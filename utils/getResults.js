const { Result, Subject, Student, ClassStats, StudentTermPerformance, Sequelize } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];
    const toOrdinal = require("./toOrdinal")

    const stp = await StudentTermPerformance.findOne({ where: { StudentId: studentId, TermId: termId } });
    let results;
    if (!stp) {
      results = await Result.findAll({
        include: [
          { model: Subject, attributes: ["id", "name"] },
          { model: StudentTermPerformance, where: { StudentId: studentId, TermId: termId }, attributes: ["ClassId", "id"] },
        ],
        order: [[Subject, "name", "ASC"]],
      });
    } else {
      results = await Result.findAll({
        where: { StudentTermPerformanceId: stp.id },
        include: [{ model: Subject, attributes: ["id", "name"] }],
        order: [[Subject, "name", "ASC"]],
      });
    }

    if (results.length === 0) {
      const legacyResults = await Result.findAll({
        where: { StudentId: studentId, TermId: termId },
        include: [{ model: Subject, attributes: ["id", "name"] }],
        order: [[Subject, "name", "ASC"]],
      })
      if (legacyResults.length === 0) return []
      results = legacyResults
    }

    // Determine class at time of result; fallback to current student class
    const student = await Student.findByPk(studentId);
    const fallbackClassId = student ? student.ClassId : null;
    const inferredClassIdFromJoin = (!stp && results[0] && results[0].StudentTermPerformance) ? results[0].StudentTermPerformance.ClassId : null;
    const classId = (stp && stp.ClassId) || inferredClassIdFromJoin || fallbackClassId;

    // Fetch ClassStats for all subjects in the results in a single query
    const subjectIds = results.map(r => r.SubjectId);
    let classStatsList = [];
    if (subjectIds.length > 0) {
      classStatsList = await ClassStats.findAll({
        where: {
          ClassId: classId,
          TermId: termId,
          SubjectId: { [Sequelize.Op.in]: subjectIds }
        },
        attributes: ["SubjectId", "classLowest", "classHighest", "classAverage"],
      });
    }

    const classStatsMap = {};
    for (const cs of classStatsList) {
      classStatsMap[cs.SubjectId] = cs;
    }

    for (const result of results) {
      const classStats = classStatsMap[result.SubjectId];

      // Attach class stats to result if found
      result.dataValues.classStats = classStats || {
        classLowest: null,
        classHighest: null,
        classAverage: null,
      };

      if(result.position) result.position = toOrdinal(result.position)
      result.dataValues.resultClassId = classId;
    }

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};

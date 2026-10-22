const {
  Result,
  Subject,
  Student,
  ClassStats,
  StudentTermPerformance,
  Sequelize,
} = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];
    const toOrdinal = require("./toOrdinal");

    const stps = await StudentTermPerformance.findAll({
      where: { StudentId: studentId, TermId: termId },
    });
    if (stps.length === 0) return [];

    const results = await Result.findAll({
      where: {
        StudentTermPerformanceId: {
          [Sequelize.Op.in]: stps.map((s) => s.id),
        },
      },
      include: [{ model: Subject, attributes: ["id", "name"] }],
      order: [[Subject, "name", "ASC"]],
    });

    if (results.length === 0) return [];

    const matchedStp =
      stps.find((s) => s.id === results[0].StudentTermPerformanceId) ||
      stps.find((s) => s.totalScore > 0) ||
      stps[0];

    // Determine class at time of result; fallback to current student class
    const student = await Student.findByPk(studentId);
    const fallbackClassId = student ? student.ClassId : null;
    const classId = (matchedStp && matchedStp.ClassId) || fallbackClassId;

    // Fetch ClassStats for all subjects in the results in a single query
    const subjectIds = results.map((r) => r.SubjectId);
    let classStatsList = [];
    if (subjectIds.length > 0) {
      classStatsList = await ClassStats.findAll({
        where: {
          ClassId: classId,
          TermId: termId,
          SubjectId: { [Sequelize.Op.in]: subjectIds },
        },
        attributes: [
          "SubjectId",
          "classLowest",
          "classHighest",
          "classAverage",
        ],
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

      if (result.position) result.position = toOrdinal(result.position);
      result.dataValues.resultClassId = classId;
    }

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};

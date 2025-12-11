const { Result, Subject, Student, ClassStats } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];
    const toOrdinal = require("./toOrdinal")

    // Fetch results along with subject details
    const results = await Result.findAll({
      where: {
        StudentId: studentId,
        TermId: termId,
      },
      include: [
        {
          model: Subject,
          attributes: ["id", "name"],
        },
      ],
      order: [[Subject, "name", "ASC"]],
    });

    if (results.length === 0) return [];

    // Determine class at time of result; fallback to current student class
    const student = await Student.findByPk(studentId);
    const fallbackClassId = student ? student.ClassId : null;

    // Fetch ClassStats for each subject in the results
    for (const result of results) {
      const classStats = await ClassStats.findOne({
        where: {
          ClassId: result.resultClassId || fallbackClassId,
          SubjectId: result.SubjectId,
          TermId: termId,
        },
        attributes: ["classLowest", "classHighest", "classAverage"],
      });

      // Attach class stats to result if found
      result.dataValues.classStats = classStats || {
        classLowest: null,
        classHighest: null,
        classAverage: null,
      };

      if(result.position) result.position = toOrdinal(result.position)
      result.dataValues.resultClassId = result.resultClassId || fallbackClassId;
    }

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};

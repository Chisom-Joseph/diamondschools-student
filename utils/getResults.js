const { Result, Subject, Student, ClassStats } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];

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

    // Fetch student details to get ClassId
    const student = await Student.findByPk(studentId);
    if (!student) return results; // If student not found, return results without class stats

    const classId = student.ClassId;

    // Fetch ClassStats for each subject in the results
    for (const result of results) {
      const classStats = await ClassStats.findOne({
        where: {
          ClassId: classId,
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
    }

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};

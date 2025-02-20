const { Result, Subject } = require("../models");

module.exports = async (termId, studentId) => {
  try {
    if (!termId || !studentId) return [];

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

    if (results.length <= 0) return [];

    return results;
  } catch (error) {
    console.error("ERROR GETTING RESULTS");
    console.error(error);
    return [];
  }
};

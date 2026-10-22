const { StudentTermPerformance, Result } = require("../models");

module.exports = async ({ studentId, classId, termId }) => {
  try {
    if (!studentId || !termId) return {};

    const stps = await StudentTermPerformance.findAll({
      where: { StudentId: studentId, TermId: termId },
      include: [{ model: Result, attributes: ["id"] }],
    });

    if (stps.length === 0) return {};

    const stp =
      stps.find((s) => s.Results && s.Results.length > 0) ||
      stps.find((s) => s.totalScore > 0) ||
      (classId ? stps.find((s) => s.ClassId === classId) : null) ||
      stps[0];

    return stp || {};
  } catch (error) {
    console.error("ERROR GETTING STUDENT TERM PERFORMANCE");
    console.error(error);
    return {};
  }
};

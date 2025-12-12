const { StudentTermPerformance } = require("../models")

module.exports = async ({ studentId, classId, termId }) => {
  try {
    if (!studentId || !termId) return {};
    const primaryWhere = classId
      ? { StudentId: studentId, ClassId: classId, TermId: termId }
      : { StudentId: studentId, TermId: termId };

    let stp = await StudentTermPerformance.findOne({ where: primaryWhere });
    if (!stp) {
      stp = await StudentTermPerformance.findOne({ where: { StudentId: studentId, TermId: termId } });
    }
    return stp || {};
  } catch (error) {
    console.error("ERROR GETTING STUDENT TERM PERFORMANCE")
    console.error(error)
    return {}
  }
}

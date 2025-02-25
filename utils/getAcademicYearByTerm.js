const { AcademicYear } = require("../models");

module.exports = async (id) => {
  try {
    const academicYear = await AcademicYear.findOne({
      where: { id },
    });
    if (!academicYear) return {};
    return academicYear;
  } catch (error) {
    console.log("ERROR GETTING ACADEMIC YEAR");
    console.log(error);
    return {};
  }
};

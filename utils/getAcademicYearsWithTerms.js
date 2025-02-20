const { AcademicYear, Term } = require("../models");

module.exports = async () => {
  try {
    const academicYears = await AcademicYear.findAll({
      include: [{ model: Term }],
    });

    console.log(academicYears);

    return academicYears;
  } catch (error) {
    console.log("ERROR GETTING ACADEMIC YEARS");
    console.log(error);
    return [];
  }
};

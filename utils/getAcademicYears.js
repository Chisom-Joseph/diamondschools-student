const { AcademicYear } = require("../models");

module.exports = async () => {
  try {
    const academicYearsFromDb = await AcademicYear.findAll();

    if (!academicYearsFromDb) return [];

    const academicYears = await Promise.all(
      academicYearsFromDb.map((academicYear) => {
        return academicYear.dataValues;
      })
    );

    console.log(academicYears);

    return academicYears;
  } catch (error) {
    console.log("ERROR GETTING ACADEMIC YEARS");
    console.log(error);
    return [];
  }
};

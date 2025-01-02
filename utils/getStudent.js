const { Student, Guardian, Class } = require("../models");

module.exports = async (id) => {
  try {
    // Get student
    const studentFromDb = await Student.findOne({ where: { id } });
    if (!studentFromDb) return {};
    const student = studentFromDb.dataValues;

    student.profileImageUrl = student.profileImageUrl
      ? `${process.env.MAIN_WEBSITE_URL}/${student.profileImageUrl}`
      : "/img/avatars/default.png";

    // Get guardian
    student.guardian = await require("./getGuardian")(student.GuardianId);

    // Get class
    student.class = await require("./getClass")(student.ClassId);

    return student;
  } catch (error) {
    console.log("ERROR GETTING STUDENT");
    console.log(error);
    return {};
  }
};

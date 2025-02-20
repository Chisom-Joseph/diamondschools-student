const { Subject } = require("../models");

module.exports = async (ClassId) => {
  try {
    const subjects = await Subject.findAll({ where: { ClassId } });

    if (subjects.length <= 0) return [];

    return subjects;
  } catch (error) {
    console.error("ERROR GETTING SUBJECTS");
    console.error(error);
    return [];
  }
};

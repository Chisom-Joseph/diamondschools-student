const { Subject } = require("../models");

module.exports = async (id) => {
  try {
    const subjectFromDb = await Subject.findOne({ where: { id } });
    return subjectFromDb?.dataValues || {};
  } catch (error) {
    console.log("ERROR GETTING SUBJECT");
    console.log(error);
    return {};
  }
};

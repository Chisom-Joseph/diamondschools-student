const { Class } = require("../models");

module.exports = async (id) => {
  try {
    const classFromDb = await Class.findOne({ where: { id } });
    return classFromDb?.dataValues || {};
  } catch (error) {
    console.log("ERROR GETTING CLASS");
    console.log(error);
    return {};
  }
};

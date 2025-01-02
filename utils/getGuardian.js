const { Guardian } = require("../models");

module.exports = async (id) => {
  try {
    const guardianFromDb = await Guardian.findOne({ where: { id } });
    return guardianFromDb?.dataValues || {};
  } catch (error) {
    console.log("ERROR GETTING GUARDIAN");
    console.log(error);
    return {};
  }
};

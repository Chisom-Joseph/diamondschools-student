const { Term } = require("../models");

module.exports = async (id) => {
  try {
    const term = await Term.findOne({
      where: { id },
    });
    if (!term) return {};
    return term;
  } catch (error) {
    console.log("ERROR GETTING TERM");
    console.log(error);
    return {};
  }
};

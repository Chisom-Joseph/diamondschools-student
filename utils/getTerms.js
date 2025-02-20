const { Term, AcademicYear } = require("../models");

module.exports = async () => {
  try {
    const formatDateForInput = require("./formatDateForInput");
    const termsFromDb = await Term.findAll({ include: AcademicYear });

    if (!termsFromDb) return [];

    const terms = await Promise.all(
      termsFromDb.map((term) => {
        term.dataValues.startDate = formatDateForInput(term.startDate);
        term.dataValues.endDate = formatDateForInput(term.endDate);
        return term.dataValues;
      })
    );

    console.log(terms);

    return terms;
  } catch (error) {
    console.log("ERROR GETTING TERMS");
    console.log(error);
    return [];
  }
};

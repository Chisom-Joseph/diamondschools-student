const { Student } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.student.id);
    if (student.blocked) {
      res.status(403).render("accountBlocked.ejs");
    }
    next();
  } catch (error) {
    console.error("ERROR IN CHECKBLOCKSTATUS MIDDLEWARE");
    console.error(error);
    res.status(500).render("error.ejs");
  }
};

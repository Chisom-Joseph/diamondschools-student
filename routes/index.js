const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard/dashboard.ejs");
});

module.exports = router;

const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");

router.use(require("../middlewares/setCurrentPath"));
router.use("/dashboard", loginVerifier, require("./dashboard"));
router.use("/auth", loginVerifier, require("./auth"));

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("*", (req, res) => {
  res.render("error.ejs");
});

module.exports = router;

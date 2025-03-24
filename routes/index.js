const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");
const checkBlockStatus = require("../middlewares/checkBlockStatus");

router.use(require("../middlewares/setCurrentPath"));
router.use(
  "/dashboard",
  loginVerifier,
  checkBlockStatus,
  require("./dashboard")
);
router.use("/auth", loginVerifier, require("./auth"));

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("*", (req, res) => {
  res.render("error.ejs");
});

module.exports = router;

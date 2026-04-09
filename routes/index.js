const router = require("express").Router();

const loginVerifier = require("../middlewares/loginVerifire");
const checkBlockStatus = require("../middlewares/checkBlockStatus");
const setUnreadNotificationCount = require("../middlewares/setUnreadNotificationCount");

router.use(require("../middlewares/setCurrentPath"));
router.use(require("../middlewares/setSiteSettings"));
router.use(
  "/dashboard",
  loginVerifier,
  checkBlockStatus,
  setUnreadNotificationCount,
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

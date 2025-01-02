const router = require("express").Router();

router.get("/sign-in", async (req, res) => {
  res.render("auth/signIn.ejs", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
  });
});
router.post("/sign-in", require("../controllers/auth/signIn"));

router.get("/logout", async (req, res) => {
  res.clearCookie("sToken");
  res.redirect("/auth/sign-in");
});

module.exports = router;

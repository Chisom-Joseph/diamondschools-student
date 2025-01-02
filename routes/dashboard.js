const router = require("express").Router();

// Dashboard
router.get("/", (req, res) => {
  // res.render("dashboard/dashboard.ejs");
  res.redirect("/dashboard/profile");
});

// Profile
router.get("/profile", async (req, res) => {
  res.render("dashboard/profile", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
  });
});

module.exports = router;

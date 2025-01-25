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

// Profile
router.get("/timetables", async (req, res) => {
  const { days, schedule } = await require("../utils/getTimetables")();

  Object.entries(schedule).forEach(([key, value]) => {
    console.log(key, value);
    console.log(key, value[0]?.time);
  });

  res.render("dashboard/timetables", {
    alert: req.flash("alert")[0] || "",
    days,
    schedule,
  });
});

module.exports = router;

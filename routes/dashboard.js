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
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const schedule = [
    {
      time: "8:00 AM - 9:00 AM",
      subjects: ["Math", "Physics", "English", "Biology", "Chemistry"],
    },
    {
      time: "9:00 AM - 10:00 AM",
      subjects: ["English", "Math", "Physics", "Chemistry", "Biology"],
    },
    {
      time: "10:00 AM - 11:00 AM",
      subjects: ["Chemistry", "English", "Biology", "Math", "Physics"],
    },
    {
      time: "11:00 AM - 12:00 PM",
      subjects: ["Physics", "Biology", "Math", "English", "Chemistry"],
    },
    {
      time: "12:00 PM - 1:00 PM",
      subjects: [
        "Lunch Break",
        "Lunch Break",
        "Lunch Break",
        "Lunch Break",
        "Lunch Break",
      ],
    },
    {
      time: "1:00 PM - 2:00 PM",
      subjects: ["Biology", "Chemistry", "Math", "Physics", "English"],
    },
    {
      time: "2:00 PM - 3:00 PM",
      subjects: ["English", "Biology", "Chemistry", "Math", "Physics"],
    },
  ];

  res.render("dashboard/timetables", {
    alert: req.flash("alert")[0] || "",
    days,
    schedule,
  });
});

module.exports = router;

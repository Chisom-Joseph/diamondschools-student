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

router.get("/notifications", async (req, res) => {
  const { UserNotification, Notification, Student } = require("../models");
  try {
    // Assuming `req.user` contains the logged-in student
    const studentId = req.student.id;

    // Fetch notifications for the student
    const userNotifications = await Student.findOne({
      where: { id: studentId },
      include: [
        {
          model: Notification,
          through: { attributes: [] },
        },
      ],
    });

    // Update seen status to true (optional, only when the student views the notification)
    await UserNotification.update(
      { seen: true },
      { where: { StudentId: studentId, seen: false } }
    );

    console.log(userNotifications.Notifications);

    // Pass notifications to the EJS template
    res.render("dashboard/notifications", {
      notifications: userNotifications.Notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

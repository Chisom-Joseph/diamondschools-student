const router = require("express").Router();

// Dashboard
router.get("/", (req, res) => {
  // res.render("dashboard/dashboard.ejs");
  res.redirect("/dashboard/profile");
});

// Profile
router.get("/profile", async (req, res) => {
  console.log(
    await require("../utils/getSubjectsByClass")(req.student.ClassId)
  );
  res.render("dashboard/profile", {
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    subjects: await require("../utils/getSubjectsByClass")(req.student.ClassId),
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

// Profile
router.get("/calendar", async (req, res) => {
  res.render("dashboard/calendar");
});

// Profile
router.get("/result", async (req, res) => {
  const { term: termId } = req.query;
  const { id: studentId } = req.student;
  const results = await require("../utils/getResults")(termId, studentId);
  const term = await require("../utils/getTerm")(termId);
  const academicYear = await require("../utils/getAcademicYearByTerm")(
    term.AcademicYearId
  );
  const studentTermPerformance =
    await require("../utils/getStudentTermPerformance")({
      termId,
      studentId,
      classId: req.student.ClassId,
    });
  if (studentTermPerformance)
    studentTermPerformance.position = require("../utils/toOrdinal")(
      studentTermPerformance.position
    );
  const outOf = await require("../utils/getOutOf")({
    termId,
    classId: studentTermPerformance?.ClassId || req.student.ClassId,
  });
  const displayClass = await require("../utils/getClass")(
    studentTermPerformance?.ClassId || req.student.ClassId
  );
  const isFeatureEnabled = await require("../utils/checkFeatureAccess")(
    "student-result-portal",
    "student",
    studentId
  );
  if (!isFeatureEnabled) {
    return res.status(403).render("featureDisabled.ejs");
  }

  res.render("dashboard/result", {
    academicYears: await require("../utils/getAcademicYearsWithTerms")(),
    form: "",
    selectedTerm: termId,
    results,
    academicYear,
    term,
    studentTermPerformance,
    outOf,
    displayClass,
  });
});

router.get("/notifications", async (req, res) => {
  const {
    UserNotification,
    Notification,
    Student,
    AcademicYear,
  } = require("../models");
  try {
    // Assuming `req.user` contains the logged-in student
    const studentId = req.student.id;

    // Fetch notifications for the student
    const userNotifications = await Student.findOne({
      where: { id: studentId },
      include: [
        {
          model: Notification,
          through: {
            model: UserNotification,
            attributes: ["seen"], // Include the `seen` attribute
          },
        },
      ],
    });

    userNotifications.Notifications.forEach((notification) => {
      notification.UserNotification.seen;
      notification.seen = notification.UserNotification.seen;
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

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
    siteSettings: req.siteSettings,
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
    siteSettings: req.siteSettings,
  });
});

// Profile
router.get("/calendar", async (req, res) => {
  res.render("dashboard/calendar", {
    siteSettings: req.siteSettings,
  });
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
  if (studentTermPerformance && studentTermPerformance.position != null)
    studentTermPerformance.position = require("../utils/toOrdinal")(studentTermPerformance.position);
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
    student: req.student,
    displayClass,
    siteSettings: req.siteSettings,
  });
});

router.get("/notifications", async (req, res) => {
  const {
    UserNotification,
    Notification,
    Student,
  } = require("../models");

  let notifications = [];
  let unseenBroadcasts = [];
  const studentId = req.student.id;
  const studentCreatedAt = req.student.createdAt;

  try {
    // 1. Get broadcast notifications targeted at all students created after student registration
    const broadcasts = await Notification.findAll({
      where: {
        targetAudience: 'all-students',
        createdAt: { [require("sequelize").Op.gte]: studentCreatedAt },
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    // 2. Get notifications linked to this student via UserNotification
    //    (includes: legacy, specific, and previously-viewed broadcasts)
    const [studentWithNotifications] = await Student.findAll({
      where: { id: studentId },
      include: [
        {
          model: Notification,
          through: {
            attributes: ["seen"],
          },
        },
      ],
    });

    const joinedNotifications = (studentWithNotifications?.Notifications || []).filter(
      n => new Date(n.createdAt) >= new Date(studentCreatedAt)
    );
    const joinedIds = new Set(joinedNotifications.map(n => n.id));

    // 3. Merge: broadcasts not yet in joined set are unseen
    unseenBroadcasts = broadcasts.filter(b => !joinedIds.has(b.id));
    notifications = [
      ...unseenBroadcasts.map(b => ({ ...b, seen: false })),
      ...joinedNotifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        targetAudience: n.targetAudience,
        createdAt: n.createdAt,
        seen: n.UserNotification?.seen ?? false,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }

  // Always render (even if fetching failed, show whatever we have)
  res.render("dashboard/notifications", {
    notifications,
    siteSettings: req.siteSettings,
  });

  // Track seen status after response is sent (errors here won't affect the user)
  try {
    for (const b of unseenBroadcasts) {
      const existing = await UserNotification.findOne({
        where: { StudentId: studentId, NotificationId: b.id },
      });
      if (!existing) {
        await UserNotification.create({
          StudentId: studentId,
          NotificationId: b.id,
          seen: true,
        });
      }
    }
    await UserNotification.update(
      { seen: true },
      { where: { StudentId: studentId, seen: false } }
    );
  } catch (trackingError) {
    console.log("Error tracking notification seen status:", trackingError);
  }
});

module.exports = router;

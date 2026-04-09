const { UserNotification, Notification, Student } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  try {
    if (!req.student) {
      res.locals.unreadNotificationCount = 0;
      return next();
    }

    const studentId = req.student.id;
    const studentCreatedAt = req.student.createdAt;
    let unreadCount = 0;

    // 1. Get broadcast notifications targeted at all students created after student registration
    const broadcasts = await Notification.findAll({
      where: {
        targetAudience: 'all-students',
        createdAt: { [Op.gte]: studentCreatedAt },
      },
      raw: true,
    });

    // 2. Get notifications linked to this student via UserNotification
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

    // 3. Count unread broadcasts (not yet in joined set)
    const unseenBroadcasts = broadcasts.filter(b => !joinedIds.has(b.id));
    unreadCount += unseenBroadcasts.length;

    // 4. Count unread joined notifications (seen = false)
    const unreadJoined = joinedNotifications.filter(n => !n.UserNotification?.seen);
    unreadCount += unreadJoined.length;

    res.locals.unreadNotificationCount = unreadCount;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.locals.unreadNotificationCount = 0;
  }
  next();
};

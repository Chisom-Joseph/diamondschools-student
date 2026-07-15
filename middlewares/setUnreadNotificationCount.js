const { UserNotification, Notification, Sequelize } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  try {
    if (!req.student) {
      res.locals.unreadNotificationCount = 0;
      return next();
    }

    const studentId = req.student.id;
    const studentCreatedAt = req.student.createdAt;

    // 1. Count unread direct notifications
    const unreadJoined = await UserNotification.count({
      where: {
        StudentId: studentId,
        seen: false,
      },
    });

    // 2. Count unseen broadcast notifications
    const unseenBroadcastsCount = await Notification.count({
      where: {
        targetAudience: "all-students",
        createdAt: { [Op.gte]: studentCreatedAt },
        id: {
          [Op.notIn]: Sequelize.literal(
            `(SELECT NotificationId FROM UserNotifications WHERE StudentId = '${studentId}')`
          ),
        },
      },
    });

    res.locals.unreadNotificationCount = unreadJoined + unseenBroadcastsCount;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.locals.unreadNotificationCount = 0;
  }
  next();
};

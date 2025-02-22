module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("UserNotification", {
    StudentId: {
      type: DataTypes.UUID, // Change to UUID if you're using UUID for Student IDs
      allowNull: true,
      references: { model: "Students", key: "id" },
      defaultValue: null,
    },
    AspirantId: {
      type: DataTypes.UUID, // Change to UUID if you're using UUID for Aspirant IDs
      allowNull: true,
      references: { model: "Aspirants", key: "id" },
      defaultValue: null,
    },
    NotificationId: {
      type: DataTypes.UUID, // Match Notification's UUID type
      allowNull: false,
      references: { model: "Notifications", key: "id" },
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return UserNotification;
};

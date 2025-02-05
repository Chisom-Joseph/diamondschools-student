module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("UserNotification", {
    StudentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Students", key: "id" },
      defaultValue: null,
    },
    AspirantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Aspirants", key: "id" },
      defaultValue: null,
    },
    NotificationId: {
      type: DataTypes.UUID,
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

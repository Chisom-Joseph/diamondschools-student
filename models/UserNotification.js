module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("UserNotification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: "Students", key: "id" },
    },
    AspirantId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: "Aspirants", key: "id" },
    },
    TeacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: "Teachers", key: "id" },
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
  }, {
    indexes: [
      { unique: true, fields: ['NotificationId', 'StudentId'], name: 'un_notif_student' },
      { unique: true, fields: ['NotificationId', 'AspirantId'], name: 'un_notif_aspirant' },
      { unique: true, fields: ['NotificationId', 'TeacherId'], name: 'un_notif_teacher' },
    ],
  });

  return UserNotification;
};

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.ENUM('all-students', 'all-aspirants', 'all-teachers', 'specific-students', 'specific-aspirants', 'specific-teachers'),
      allowNull: true,
      defaultValue: null,
    },
  });

  return Notification;
};

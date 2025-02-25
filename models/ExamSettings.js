module.exports = (sequelize, DataTypes) => {
  const ExamSettings = sequelize.define("ExamSettings", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    uniqueKey: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      defaultValue: 1,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    questionLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    shuffleQuestions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    shuffleOptions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    markPerQuestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  });
  return ExamSettings;
};

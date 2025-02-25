module.exports = (sequelize, DataTypes) => {
  const StudentTermPerformance = sequelize.define("StudentTermPerformance", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    averageScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    overallRemark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teachersRemark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return StudentTermPerformance;
};

module.exports = (sequelize, DataTypes) => {
  const FeatureFlag = sequelize.define("FeatureFlag", {
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
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    feature: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    userGroup: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
  });
  return FeatureFlag;
};

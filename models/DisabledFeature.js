module.exports = (sequelize, DataTypes) => {
  const DisabledFeatures = sequelize.define("DisabledFeatures", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    featureName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    user: {
      type: DataTypes.STRING,
      defaultValue: "all",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    disabledOn: {
      type: DataTypes.STRING,
      defaultValue: Date.now(),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  return DisabledFeatures;
};

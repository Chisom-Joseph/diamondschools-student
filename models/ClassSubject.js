module.exports = (sequelize, DataTypes) => {
  const ClassSubject = sequelize.define("ClassSubject", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    SubjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Subject", key: "id" },
      unique: false,
    },
    ClassId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Class", key: "id" },
      unique: false,
    },
  });

  return ClassSubject;
};

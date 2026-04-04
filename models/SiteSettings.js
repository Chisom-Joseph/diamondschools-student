module.exports = (sequelize, DataTypes) => {
  const SiteSettings = sequelize.define("SiteSettings", {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Diamond Schools",
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Diamond Schools",
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Diamond Schools",
      validate: {
        notEmpty: true,
      },
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "Diamond Schools",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "diamondschoolsnkpor@gmail.com",
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "No.7 Ernest Odili Crescent, Nkpor, Anambra State, Nigeria",
      validate: {
        notEmpty: true,
      },
    },
    phone1: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "07057430682",
      validate: {
        notEmpty: true,
      },
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "08026125461",
    },
    phone3: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "08130331977",
    },
    favicon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/assets/img/logo/favicon.png",
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/assets/img/logo/logo.png",
    },
    logoLight: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/assets/img/logo/logo-light.png",
    },
  });
  return SiteSettings;
};

const dbConfig = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const Admin = require("./Admin");
const Teacher = require("./Teacher");
const Student = require("./Student");
const Class = require("./Class");
const Timetable = require("./Timetable");
const Guardian = require("./Guardian");
const Religion = require("./Religion");
const Aspirant = require("./Aspirant");
const DisabledFeatures = require("./DisabledFeature");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    connectTimeout: 100000,
  },
  define: {
    timestamps: false,
  },
  polli: {
    min: dbConfig.poll.min,
    max: dbConfig.poll.max,
    aquire: dbConfig.poll.acquire,
    idle: dbConfig.poll.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// DBs
db.Admin = Admin(sequelize, DataTypes);
db.Teacher = Teacher(sequelize, DataTypes);
db.Student = Student(sequelize, DataTypes);
db.Class = Class(sequelize, DataTypes);
db.Timetable = Timetable(sequelize, DataTypes);
db.Guardian = Guardian(sequelize, DataTypes);
db.Religion = Religion(sequelize, DataTypes);
db.Aspirant = Aspirant(sequelize, DataTypes);
db.DisabledFeatures = DisabledFeatures(sequelize, DataTypes);

// Relations
db.Student.belongsTo(db.Class);
db.Class.hasMany(db.Student);

db.Student.belongsTo(db.Guardian);
db.Guardian.hasMany(db.Student);

db.Student.belongsTo(db.Religion);
db.Religion.hasMany(db.Student);

db.Aspirant.belongsTo(db.Guardian);
db.Guardian.hasMany(db.Aspirant);

db.Aspirant.belongsTo(db.Class);
db.Class.hasMany(db.Aspirant);

db.Timetable.belongsTo(db.Class);
db.Class.hasMany(db.Timetable);

module.exports = db;

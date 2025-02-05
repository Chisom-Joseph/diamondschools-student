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
const Subject = require("./Subject");
const DisabledFeatures = require("./DisabledFeature");
const AttemptedSubject = require("./AttemptedSubject");
const Question = require("./Question");
const Option = require("./Option");
const OptionName = require("./OptionName");
const Notification = require("./Notification");
const UserNotification = require("./UserNotification");

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
db.Subject = Subject(sequelize, DataTypes);
db.DisabledFeatures = DisabledFeatures(sequelize, DataTypes);
db.AttemptedSubject = AttemptedSubject(sequelize, DataTypes);
db.Question = Question(sequelize, DataTypes);
db.Option = Option(sequelize, DataTypes);
db.OptionName = OptionName(sequelize, DataTypes);
db.Notification = Notification(sequelize, DataTypes);
db.UserNotification = UserNotification(sequelize, DataTypes);

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

db.Subject.belongsTo(db.Class);
db.Class.hasMany(db.Subject);

db.AttemptedSubject.belongsTo(db.Subject);
db.Subject.hasMany(db.AttemptedSubject);

db.AttemptedSubject.belongsTo(db.Aspirant);
db.Aspirant.hasMany(db.AttemptedSubject);

db.AttemptedSubject.belongsTo(db.Student);
db.Student.hasMany(db.AttemptedSubject);

db.Question.belongsTo(db.Subject);
db.Subject.hasMany(db.Question);

db.Option.belongsTo(db.Question);
db.Question.hasMany(db.Option);

// db.Student.belongsToMany(db.Notification, { through: db.UserNotification });
// db.Aspirant.belongsToMany(db.Notification, { through: db.UserNotification });
// db.Notification.belongsToMany(db.Student, { through: db.UserNotification });
// db.Notification.belongsToMany(db.Aspirant, { through: db.UserNotification });

db.Student.belongsToMany(db.Notification, {
  through: db.UserNotification,
  foreignKey: "StudentId",
});

db.Aspirant.belongsToMany(db.Notification, {
  through: db.UserNotification,
  foreignKey: "AspirantId",
});

db.Notification.belongsToMany(db.Student, {
  through: db.UserNotification,
  foreignKey: "NotificationId",
  targetKey: "id", // 👈 Ensure it correctly maps to UUID
});

db.Notification.belongsToMany(db.Aspirant, {
  through: db.UserNotification,
  foreignKey: "NotificationId",
  targetKey: "id",
});

module.exports = db;

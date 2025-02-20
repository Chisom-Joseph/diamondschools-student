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
const AcademicYear = require("./AcademicYear");
const Term = require("./Term");
const Result = require("./Result");

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
db.AcademicYear = AcademicYear(sequelize, DataTypes);
db.Term = Term(sequelize, DataTypes);
db.Result = Result(sequelize, DataTypes);

// Relations
db.Student.belongsTo(db.Class, { onDelete: "SET NULL" });
db.Class.hasMany(db.Student, { onDelete: "SET NULL" });

db.Student.belongsTo(db.Guardian, { onDelete: "SET NULL" });
db.Guardian.hasMany(db.Student, { onDelete: "SET NULL" });

db.Student.belongsTo(db.Religion, { onDelete: "SET NULL" });
db.Religion.hasMany(db.Student, { onDelete: "SET NULL" });

db.Aspirant.belongsTo(db.Guardian, { onDelete: "SET NULL" });
db.Guardian.hasMany(db.Aspirant, { onDelete: "SET NULL" });

db.Aspirant.belongsTo(db.Class, { onDelete: "SET NULL" });
db.Class.hasMany(db.Aspirant, { onDelete: "SET NULL" });

db.Timetable.belongsTo(db.Class, { onDelete: "SET NULL" });
db.Class.hasMany(db.Timetable, { onDelete: "SET NULL" });

db.Subject.belongsTo(db.Class, { onDelete: "SET NULL" }); // SUBJECT SHOULD NOT BELONG TO A CLASS
db.Class.hasMany(db.Subject, { onDelete: "SET NULL" });

db.AttemptedSubject.belongsTo(db.Subject, { onDelete: "CASCADE" });
db.Subject.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.AttemptedSubject.belongsTo(db.Aspirant, { onDelete: "CASCADE" });
db.Aspirant.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.AttemptedSubject.belongsTo(db.Student, { onDelete: "CASCADE" });
db.Student.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.Question.belongsTo(db.Subject, { onDelete: "CASCADE" });
db.Subject.hasMany(db.Question, { onDelete: "CASCADE" });

db.Option.belongsTo(db.Question, { onDelete: "CASCADE" });
db.Question.hasMany(db.Option, { onDelete: "CASCADE" });

db.Student.belongsToMany(db.Notification, {
  through: db.UserNotification,
  foreignKey: "StudentId",
  onDelete: "CASCADE",
});

db.Aspirant.belongsToMany(db.Notification, {
  through: db.UserNotification,
  foreignKey: "AspirantId",
  onDelete: "CASCADE",
});

db.Notification.belongsToMany(db.Student, {
  through: db.UserNotification,
  foreignKey: "NotificationId",
  targetKey: "id",
  onDelete: "CASCADE",
});

db.Notification.belongsToMany(db.Aspirant, {
  through: db.UserNotification,
  foreignKey: "NotificationId",
  targetKey: "id",
  onDelete: "CASCADE",
});

db.Term.belongsTo(db.AcademicYear, { onDelete: "CASCADE" });
db.AcademicYear.hasMany(db.Term, { onDelete: "CASCADE" });

db.Result.belongsTo(db.Student, {
  onDelete: "CASCADE",
});
db.Student.hasMany(db.Result, {
  onDelete: "CASCADE",
});

db.Result.belongsTo(db.Subject, {
  onDelete: "SET NULL",
});
db.Subject.hasMany(db.Result, {
  onDelete: "SET NULL",
});

db.Result.belongsTo(db.Term, {
  onDelete: "SET NULL",
});
db.Term.hasMany(db.Result, {
  onDelete: "SET NULL",
});

module.exports = db;

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
const ClassSubject = require("./ClassSubject");
const ExamSettings = require("./ExamSettings");
const ClassStats = require("./ClassStats");
const StudentTermPerformance = require("./StudentTermPerformance");
const FeatureFlag = require("./FeatureFlag");
const FeatureAccess = require("./FeatureAccess");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    connectTimeout: 100000,
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
db.ClassSubject = ClassSubject(sequelize, DataTypes);
db.ExamSettings = ExamSettings(sequelize, DataTypes);
db.ClassStats = ClassStats(sequelize, DataTypes);
db.StudentTermPerformance = StudentTermPerformance(sequelize, DataTypes);
db.FeatureFlag = FeatureFlag(sequelize, DataTypes);
db.FeatureAccess = FeatureAccess(sequelize, DataTypes);

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

db.Subject.belongsToMany(db.Class, {
  through: db.ClassSubject,
  foreignKey: "SubjectId",
  onDelete: "CASCADE",
});

db.Class.belongsToMany(db.Subject, {
  through: db.ClassSubject,
  foreignKey: "ClassId",
  onDelete: "CASCADE",
});

db.AttemptedSubject.belongsTo(db.Subject, { onDelete: "CASCADE" });
db.Subject.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.AttemptedSubject.belongsTo(db.Aspirant, { onDelete: "CASCADE" });
db.Aspirant.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.AttemptedSubject.belongsTo(db.Student, { onDelete: "CASCADE" });
db.Student.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.AttemptedSubject.belongsTo(db.Term, { onDelete: "CASCADE" });
db.Term.hasMany(db.AttemptedSubject, { onDelete: "CASCADE" });

db.Question.belongsTo(db.Subject, { onDelete: "CASCADE" });
db.Subject.hasMany(db.Question, { onDelete: "CASCADE" });

db.Option.belongsTo(db.Question, { onDelete: "CASCADE" });
db.Question.hasMany(db.Option, { onDelete: "CASCADE" });

db.Question.belongsTo(db.Term, { onDelete: "CASCADE" });
db.Term.hasMany(db.Question, { onDelete: "CASCADE" });

db.Question.belongsTo(db.Class, { onDelete: "CASCADE" });
db.Class.hasMany(db.Question, { onDelete: "CASCADE" });

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

db.Student.belongsTo(db.AcademicYear, { onDelete: "SET NULL" });
db.AcademicYear.hasMany(db.Student, { onDelete: "SET NULL" });

db.Aspirant.belongsTo(db.AcademicYear, { onDelete: "SET NULL" });
db.AcademicYear.hasMany(db.Aspirant, { onDelete: "SET NULL" });

db.Result.belongsTo(db.Student, {
  onDelete: "CASCADE",
});
db.Student.hasMany(db.Result, {
  onDelete: "CASCADE",
});

db.Result.belongsTo(db.Subject, {
  onDelete: "CASCADE",
});
db.Subject.hasMany(db.Result, {
  onDelete: "CASCADE",
});

db.Result.belongsTo(db.Term, {
  onDelete: "SET NULL",
});
db.Term.hasMany(db.Result, {
  onDelete: "SET NULL",
});

db.ClassStats.belongsTo(db.Subject, {
  onDelete: "CASCADE",
});
db.Subject.hasMany(db.ClassStats, {
  onDelete: "CASCADE",
});

db.ClassStats.belongsTo(db.Term, {
  onDelete: "CASCADE",
});
db.Term.hasMany(db.ClassStats, {
  onDelete: "CASCADE",
});

db.ClassStats.belongsTo(db.Class, {
  onDelete: "CASCADE",
});
db.Class.hasMany(db.ClassStats, {
  onDelete: "CASCADE",
});

db.StudentTermPerformance.belongsTo(db.Student, {
  onDelete: "CASCADE",
});
db.Student.hasMany(db.StudentTermPerformance, {
  onDelete: "CASCADE",
});

db.StudentTermPerformance.belongsTo(db.Class, {
  onDelete: "CASCADE",
});
db.Class.hasMany(db.StudentTermPerformance, {
  onDelete: "CASCADE",
});

db.StudentTermPerformance.belongsTo(db.Term, {
  onDelete: "CASCADE",
});
db.Term.hasMany(db.StudentTermPerformance, {
  onDelete: "CASCADE",
});

db.FeatureFlag.hasMany(db.FeatureAccess, { onDelete: "CASCADE" });
db.FeatureAccess.belongsTo(db.FeatureFlag, { onDelete: "CASCADE" });

module.exports = db;

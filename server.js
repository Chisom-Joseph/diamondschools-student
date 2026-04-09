require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 2394 || process.env.PORT;
const db = require("./models");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes"));

console.log("Waiting for database connection...");
db.sequelize
  .authenticate()
  .then(async () => {
    console.log(`Database connection successful!`);
    return db.sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    const config = db.sequelize.config;
    console.table({
      dialect: config.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
    });
    app.listen(PORT, () => {
      console.log(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(error));

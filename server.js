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
  .sync({ force: false, alter: false, benchmark: true })
  .then(({ options, config }) => {
    console.log(`Database connection sucessfull!`);
    console.table({
      dialect: options.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
      database_protocol: config.protocol,
      database_port: config.port,
    });
    app.listen(PORT, () => {
      console.log(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(error));

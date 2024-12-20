require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 2394 || process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require("./routes"));

app.listen(PORT, () =>
  console.log(`Server is up and running on http://localhost:${PORT}/`)
);

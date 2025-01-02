const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signInScema = require("../../validation/signIn");
const { Student } = require("../../models");

module.exports = async (req, res) => {
  try {
    // Validate the student
    const studentValid = signInScema.validate(req.body);
    if (studentValid.error) {
      req.flash("alert", {
        status: "error",
        message: studentValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Check if user exsists
    const studentExsits = await Student.findOne({
      where: { registrationNumber: req.body.registrationNumber },
    });
    if (!studentExsits) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    const student = studentExsits.dataValues;

    // Check if Password is correct
    const passwordsCorrect = await bcrypt.compare(
      req.body.password,
      student.password
    );
    if (!passwordsCorrect) {
      req.flash("alert", {
        status: "error",
        message: "Username, Email, or Password incorrect",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/auth/sign-in");
    }

    // Set expiry date for cookie and token
    let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (req.body.rememberMe && req.body.rememberMe === "on") {
      expiresIn = "3d";
      expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    // Generate login token
    const token = jwt.sign(
      { id: student.id },
      process.env.STUDENT_TOKEN_SECRET,
      {
        expiresIn,
      }
    );
    res.cookie("sToken", token, { expires, path: "/" });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(`ERROR CREATING USER ACCOUNT: ${error}`);
    req.flash("alert", {
      status: "error",
      message: "An unexpected error occured",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/auth/sign-in");
  }
};

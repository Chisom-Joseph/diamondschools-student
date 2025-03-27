const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.sToken;
    const authRoutes = ["/auth/sign-in"];

    if (!token && !authRoutes.includes(req.originalUrl)) {
      res.clearCookie("sToken");
      return res.redirect("/auth/sign-in");
    }

    if (!token && authRoutes.includes(req.originalUrl)) {
      next();
    }

    const tokenVerified = jwt.verify(token, process.env.STUDENT_TOKEN_SECRET);

    if (!tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    if (tokenVerified && authRoutes.includes(req.originalUrl)) {
      return res.redirect("/dashboard");
    }

    if (!tokenVerified && !authRoutes.includes(req.originalUrl)) {
      return res.redirect("/auth/sign-in");
    }

    const student = await require("../utils/getStudent")(tokenVerified.id);

    if (Object.keys(student).length === 0) {
      res.clearCookie("sToken");
      return res.redirect("/auth/sign-in");
    }

    req.student = student;
    res.locals.student = student;
    res.locals.isLoggedin = true;
    res.locals.isFeatureEnabled = await require("../utils/getEnabledFeatures")(
      "student",
      student.id
    );
    return next();
  } catch (error) {
    console.error("ERROR VERIFING LOGIN");
    console.error(error);
  }
};

const getSiteSettings = require("../utils/getSiteSettings");

module.exports = async (req, res, next) => {
  try {
    req.siteSettings = await getSiteSettings();
    next();
  } catch (error) {
    console.error("Error setting site settings:", error);
    next();
  }
};

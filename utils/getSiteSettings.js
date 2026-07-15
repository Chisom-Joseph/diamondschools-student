const { SiteSettings } = require("../models");

const defaults = {
  name: "Diamond Schools",
  title: "Diamond Schools",
  description: "Diamond Schools",
  keywords: "Diamond Schools",
  email: "diamondschoolsnkpor@gmail.com",
  address: "No.7 Ernest Odili Crescent, Nkpor, Anambra State, Nigeria",
  phone1: "07057430682",
  phone2: "08026125461",
  phone3: "08130331977",
  favicon: "/assets/img/logo/favicon.png",
  logo: "/assets/img/logo/logo.png",
  logoLight: "/assets/img/logo/logo-light.png",
};

let cachedSettings = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

module.exports = async () => {
  const now = Date.now();
  if (cachedSettings && (now - lastFetchTime) < CACHE_TTL) {
    return cachedSettings;
  }
  
  try {
    const siteSettings = await SiteSettings.findOne({
      where: { uniqueKey: 1 },
    });
    if (!siteSettings) {
      cachedSettings = defaults;
    } else {
      cachedSettings = siteSettings.toJSON();
    }
    lastFetchTime = now;
    return cachedSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return cachedSettings || defaults;
  }
};

module.exports.clearCache = () => {
  cachedSettings = null;
  lastFetchTime = 0;
};

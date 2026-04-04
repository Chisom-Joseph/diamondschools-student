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

module.exports = async () => {
  try {
    const siteSettings = await SiteSettings.findOne({
      where: { uniqueKey: 1 },
    });
    if (!siteSettings) return defaults;
    return siteSettings.toJSON();
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return defaults;
  }
};

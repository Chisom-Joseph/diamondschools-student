const { FeatureAccess, FeatureFlag } = require("../models");

module.exports = async (userType, userUuid) => {
  try {
    const enabledFeatures = new Set();

    // Get enabled features for the specific user
    if (userUuid) {
      const userFeatures = await FeatureAccess.findAll({
        where: { userId: userUuid, enabled: true },
        include: [{ model: FeatureFlag }],
      });

      userFeatures.forEach((entry) =>
        enabledFeatures.add(entry.FeatureFlag.feature)
      );
    }

    // Get enabled features for user groups
    if (userType) {
      const groupFeatures = await FeatureAccess.findAll({
        where: { userType, enabled: true },
        include: [{ model: FeatureFlag }],
      });

      groupFeatures.forEach((entry) =>
        enabledFeatures.add(entry.FeatureFlag.feature)
      );
    }

    // Return a function to check feature access
    return (featureName) => enabledFeatures.has(featureName);
  } catch (error) {
    console.error("❌ Error retrieving feature flags:", error);
    return () => false; // Always return false in case of an error
  }
};

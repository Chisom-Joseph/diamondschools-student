const { FeatureFlag, FeatureAccess } = require("../models");

const checkFeatureAccess = async (
  featureName,
  userType = null,
  userUuid = null
) => {
  try {
    // Find the feature flag by name
    const featureFlag = await FeatureFlag.findOne({
      where: { feature: featureName },
      include: [{ model: FeatureAccess }],
    });

    if (!featureFlag) {
      console.log(`⚠️ Feature '${featureName}' not found.`);
      return false;
    }

    // Check if feature is enabled for a specific user
    if (userUuid) {
      const userFeature = featureFlag.FeatureAccesses.find(
        (access) => access.userId === userUuid && access.enabled
      );
      if (userFeature) {
        return true;
      }
    }

    // Check if feature is enabled for a user group
    if (userType) {
      const groupFeature = featureFlag.FeatureAccesses.find(
        (access) => access.userType === userType && access.enabled
      );
      if (groupFeature) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("❌ Error checking feature access:", error);
    return false;
  }
};

module.exports = checkFeatureAccess;

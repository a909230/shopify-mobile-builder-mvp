const customerConfig = require('./src/config/customer.json');

const isWhiteLabel = customerConfig.isWhiteLabel;

export default ({ config }) => {
  return {
    ...config,
    // Use customer name/slug if white label, otherwise default from app.json
    name: isWhiteLabel ? customerConfig.name : config.name,
    slug: isWhiteLabel ? customerConfig.slug : config.slug,
    
    // In a real scenario, you'd download the icon to assets/ and reference it here
    // icon: isWhiteLabel ? "./assets/customer-icon.png" : config.icon,

    ios: {
      ...config.ios,
      bundleIdentifier: isWhiteLabel ? customerConfig.bundleId : "com.mobilebuilder.preview",
    },
    android: {
      ...config.android,
      package: isWhiteLabel ? customerConfig.bundleId : "com.mobilebuilder.preview",
    },
    extra: {
      ...config.extra,
      isWhiteLabel: isWhiteLabel,
    },
  };
};

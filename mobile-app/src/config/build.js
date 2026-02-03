import customerConfig from './customer.json';

// If isWhiteLabel is true, we export the config. 
// Otherwise we export null (Preview Mode).
export const BUILD_CONFIG = customerConfig.isWhiteLabel ? customerConfig : null;

const fs = require('fs');
const path = require('path');

// Default API URL (can be overridden)
const API_URL = process.env.API_URL || 'https://lutose-joyously-jasmine.ngrok-free.dev';

const storeCode = process.argv[2];

if (!storeCode) {
  console.error('Usage: npm run build-customer <STORE_CODE>');
  process.exit(1);
}

async function fetchConfig() {
  console.log(`Fetching config for store code: ${storeCode} from ${API_URL}...`);
  
  try {
    const response = await fetch(`${API_URL}/api/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: storeCode })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Found store: ${data.appName || data.shop}`);
    
    // Construct the White Label Config
    const customerConfig = {
      isWhiteLabel: true,
      shop: data.shop,
      storefrontAccessToken: data.storefrontAccessToken,
      primaryColor: data.primaryColor,
      logoUrl: data.logoUrl,
      home: {
        bannerUrl: data.bannerUrl,
        welcomeTitle: data.welcomeTitle,
        welcomeSubtitle: data.welcomeSubtitle
      },
      // App Store Metadata
      name: data.appName || "My Store",
      slug: (data.appName || "mystore").toLowerCase().replace(/[^a-z0-9]/g, '-'),
      bundleId: `com.mobilebuilder.${(data.appName || "mystore").toLowerCase().replace(/[^a-z0-9]/g, '')}`
    };

    // Write to src/config/customer.json
    const configPath = path.join(__dirname, '../src/config/customer.json');
    fs.writeFileSync(configPath, JSON.stringify(customerConfig, null, 2));
    
    console.log(`✅ Configuration written to ${configPath}`);
    console.log(`🚀 Ready to build! Run 'eas build' now.`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fetchConfig();

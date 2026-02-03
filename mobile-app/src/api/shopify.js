import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchProducts() {
  try {
    const configStr = await AsyncStorage.getItem('storeConfig');
    if (!configStr) throw new Error('No store config found');
    
    const config = JSON.parse(configStr);
    const { shop, storefrontAccessToken } = config;
    
    if (!shop || !storefrontAccessToken) {
      throw new Error('Missing shop or access token');
    }

    const query = `
      {
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shop}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchProductDetails(productId) {
  try {
    const configStr = await AsyncStorage.getItem('storeConfig');
    if (!configStr) throw new Error('No store config found');
    
    const config = JSON.parse(configStr);
    const { shop, storefrontAccessToken } = config;

    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          descriptionHtml
          images(first: 5) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shop}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ 
        query,
        variables: { id: productId }
      }),
    });

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data.product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
}

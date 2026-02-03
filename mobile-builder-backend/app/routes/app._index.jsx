import { useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  ColorPicker,
  InlineStack,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  let config = await db.storeConfig.findUnique({
    where: { shop: session.shop },
  });

  if (!config) {
    // Create default config if none exists
    const shortCode = Math.floor(100000 + Math.random() * 900000).toString();
    config = await db.storeConfig.create({
      data: {
        shop: session.shop,
        shortCode,
        primaryColor: "#000000",
      },
    });
  }

  return json({ config });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  // Handle Token Generation
  if (intent === "generateToken") {
    const response = await admin.graphql(
      `#graphql
      mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          storefrontAccessToken {
            accessToken
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          input: {
            title: "Mobile App Builder",
          },
        },
      }
    );

    const responseJson = await response.json();
    const token = responseJson.data.storefrontAccessTokenCreate.storefrontAccessToken?.accessToken;

    if (token) {
      await db.storeConfig.update({
        where: { shop: session.shop },
        data: { storefrontAccessToken: token },
      });
      return json({ status: "success", token });
    }
    
    return json({ status: "error", errors: responseJson.data.storefrontAccessTokenCreate.userErrors });
  }

  // Handle Settings Update
  const primaryColor = formData.get("primaryColor");
  const logoUrl = formData.get("logoUrl");

  if (primaryColor || logoUrl) {
    await db.storeConfig.update({
      where: { shop: session.shop },
      data: {
        ...(primaryColor && { primaryColor }),
        ...(logoUrl && { logoUrl }),
      },
    });
  }

  return json({ status: "success" });
};

export default function Index() {
  const { config } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <Page>
      <TitleBar title="Mobile App Builder" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Your Mobile App Access
                </Text>
                
                <Banner title="Invite Code" tone="success">
                  <p>
                    Share this code with your customers to give them access to your mobile app.
                  </p>
                  <Text as="h1" variant="headingXl" fontWeight="bold">
                    {config.shortCode}
                  </Text>
                </Banner>

                {/* API Token Section */}
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    Native App Integration
                  </Text>
                  {config.storefrontAccessToken ? (
                    <Banner tone="info">
                      <p>✅ Native API Access Enabled</p>
                      <div style={{ marginTop: '10px' }}>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="generateToken" />
                          <Button submit variant="plain" loading={fetcher.state === "submitting"}>
                            Regenerate Token
                          </Button>
                        </fetcher.Form>
                      </div>
                    </Banner>
                  ) : (
                    <Banner tone="warning" title="API Access Needed">
                      <p>Enable native products fetching by generating an access token.</p>
                      <div style={{ marginTop: '10px' }}>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="generateToken" />
                          <Button submit loading={fetcher.state === "submitting"}>
                            Enable Native App
                          </Button>
                        </fetcher.Form>
                      </div>
                    </Banner>
                  )}
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    App Branding
                  </Text>
                  <fetcher.Form method="post">
                    <BlockStack gap="400">
                      <TextField
                        label="Logo URL"
                        name="logoUrl"
                        defaultValue={config.logoUrl}
                        autoComplete="off"
                        helpText="Paste a URL to your logo image"
                      />
                      <TextField
                        label="Primary Color (Hex)"
                        name="primaryColor"
                        defaultValue={config.primaryColor}
                        autoComplete="off"
                      />
                      <Button submit loading={fetcher.state === "submitting"}>
                        Save Settings
                      </Button>
                    </BlockStack>
                  </fetcher.Form>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

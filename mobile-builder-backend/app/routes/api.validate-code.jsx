import { json } from "@remix-run/node";
import db from "../db.server";

// Simple CORS helper to avoid external dependency issues
const cors = (request, response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return response;
};

export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return cors(request, new Response(null, { status: 204 }));
  }
  return json({ message: "Method not allowed" }, { status: 405 });
};

export const action = async ({ request }) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return cors(request, new Response(null, { status: 204 }));
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return cors(request, json({ error: "Code is required" }, { status: 400 }));
    }

    const storeConfig = await db.storeConfig.findUnique({
      where: { shortCode: code },
    });

    if (!storeConfig) {
      return cors(request, json({ error: "Invalid store code" }, { status: 404 }));
    }

    return cors(request, json({
      shop: storeConfig.shop,
      appName: storeConfig.appName,
      logoUrl: storeConfig.logoUrl,
      primaryColor: storeConfig.primaryColor,
      bannerUrl: storeConfig.bannerUrl,
      welcomeTitle: storeConfig.welcomeTitle,
      welcomeSubtitle: storeConfig.welcomeSubtitle,
      storefrontAccessToken: storeConfig.storefrontAccessToken, // Return the token!
    }));
  } catch (error) {
    console.error(error);
    return cors(request, json({ error: "Internal server error" }, { status: 500 }));
  }
};

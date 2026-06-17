const { getStore } = require("@netlify/blobs");

const STORE_NAME = "yunjian-inventory";
const STATE_KEY = "state";

function getInventoryStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_TOKEN;

  if (siteID && token) {
    return getStore(STORE_NAME, { siteID, token });
  }

  return getStore(STORE_NAME);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Cache-Control": "no-store",
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  };
}

function normalizePayload(raw) {
  if (!raw || typeof raw !== "object") return null;
  const state = raw.state;
  if (!state || typeof state !== "object") return null;
  return {
    version: 1,
    createdAt: String(state.createdAt || new Date().toISOString()),
    updatedAt: new Date().toISOString(),
    items: Array.isArray(state.items) ? state.items : [],
    inbound: Array.isArray(state.inbound) ? state.inbound : [],
    outbound: Array.isArray(state.outbound) ? state.outbound : [],
    dailyTarget: state.dailyTarget || { date: new Date().toISOString().slice(0, 10), text: "" },
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  let store;
  try {
    store = getInventoryStore();
  } catch (error) {
    return json(500, {
      error: "Netlify Blobs 尚未設定完成",
      detail: error.message,
      need: ["NETLIFY_SITE_ID", "NETLIFY_AUTH_TOKEN"],
    });
  }

  if (event.httpMethod === "GET") {
    const state = await store.get(STATE_KEY, { type: "json" });
    return json(200, {
      state,
      empty: !state,
      source: "netlify-blobs",
    });
  }

  if (event.httpMethod === "POST") {
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "JSON 格式錯誤" });
    }

    const state = normalizePayload(payload);
    if (!state) return json(400, { error: "缺少庫存資料" });

    await store.setJSON(STATE_KEY, state);
    return json(200, {
      state,
      source: "netlify-blobs",
    });
  }

  return json(405, { error: "Method not allowed" });
};

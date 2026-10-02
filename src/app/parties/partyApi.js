"use client";

// Client for the public party/catering routes.
//
// Calls go to the same-origin route handler at /api/party, which forwards to the
// Supabase edge function `drawer-auth` server-side. Keeping the browser on a
// same-origin URL avoids CORS failures when the site is opened on 127.0.0.1, a
// LAN IP, or a preview host, and keeps the Supabase anon key off the client.
//
// All three routes go through the single /api/party endpoint, distinguished by
// a `route` field in the body:
//
//   POST /api/party
//   { "route": "party-public-config" }
//   { "route": "party-public-quote",  ... }
//   { "route": "party-public-submit", ... }
//
// See PARTY-PUBLIC-CONTRACT.md for the exact request/response shapes.

async function call(route, payload = {}) {
  let res;
  try {
    res = await fetch("/api/party", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route, ...payload }),
    });
  } catch {
    throw new Error("Could not reach the party service. Check your connection and try again.");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, error: "Unexpected response from the server." };
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export function getConfig() {
  return call("party-public-config");
}

export function getQuote(payload) {
  return call("party-public-quote", payload);
}

export function submitParty(payload) {
  return call("party-public-submit", payload);
}

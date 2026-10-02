"use client";

// Public contact-form client. Posts to the same-origin route handler at
// /api/party, which forwards to the Supabase edge function `drawer-auth`
// server-side. That keeps the Supabase anon key out of the browser bundle and
// avoids CORS failures on 127.0.0.1, LAN IPs and preview hosts.
//
//   POST /api/party
//   { "route": "contact-public-submit", ... }

export async function submitContact(payload) {
  let res;
  try {
    res = await fetch("/api/party", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: "contact-public-submit", ...payload }),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, error: "Unexpected response from the server." };
  }

  if (!res.ok || data?.ok === false) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.field = data?.field;
    throw err;
  }
  return data.data || {};
}

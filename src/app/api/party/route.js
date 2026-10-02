import { NextResponse } from "next/server";

// Same-origin proxy for the public party/catering routes.
//
// The /parties page posts here instead of calling the Supabase edge function
// directly. Why:
//   - The edge function only whitelists a few origins (localhost + the
//     production domain). Calling it straight from the browser means any other
//     origin (127.0.0.1, a LAN IP, a preview host) is blocked by CORS and the
//     page falls back to "We couldn't load party details". A same-origin proxy
//     sidesteps CORS entirely.
//   - The Supabase anon key stays on the server instead of shipping in the
//     client bundle.
//
// The edge function itself lives in the dashboard repo; request/response shapes
// are documented in PARTY-PUBLIC-CONTRACT.md.

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://uumrgsdkeqagmkoedfow.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXJnc2RrZXFhZ21rb2VkZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzYzODYsImV4cCI6MjA5NDI1MjM4Nn0.9M2eGZ1KwEw0Ooo-ligIpSbzzcTE8XUf3PLkisVwCt8";

// Only public site forms may be proxied. Anything else is rejected so this
// endpoint can never be used to reach other drawer-auth routes.
const ALLOWED_ROUTES = new Set([
  "party-public-config",
  "party-public-quote",
  "party-public-submit",
  "contact-public-submit",
]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!ALLOWED_ROUTES.has(body?.route)) {
    return NextResponse.json(
      { ok: false, error: "Unknown party route." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${SUPABASE_URL}/functions/v1/drawer-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Pass the edge function's status and body through unchanged so the client
    // keeps parsing the same { ok, data } / { ok:false, error } envelopes.
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not reach the party service. Please try again." },
      { status: 502 }
    );
  }
}

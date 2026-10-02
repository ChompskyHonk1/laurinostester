// Public calendar feed for laurinostavern.com.
//
// Source of truth is the Supabase `events` table, managed from the dashboard.
// RLS only exposes visibility='public' events to the anon key, so private and
// employee events never leave the building. The response keeps the shape the
// calendar component already renders: { id, title, date, time, description, type }.

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uumrgsdkeqagmkoedfow.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXJnc2RrZXFhZ21rb2VkZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzYzODYsImV4cCI6MjA5NDI1MjM4Nn0.9M2eGZ1KwEw0Ooo-ligIpSbzzcTE8XUf3PLkisVwCt8";

export const dynamic = "force-dynamic";

function toDateAndTime(startAt, allDay) {
  const d = new Date(startAt);
  // Noon, not a bare YYYY-MM-DD: the calendar component does new Date(date),
  // and a date-only string parses as UTC midnight — which shows a day early in
  // US timezones.
  const ymd = d.toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD
  const time = allDay
    ? "All Day"
    : d.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
      });
  return { date: `${ymd}T12:00:00`, time };
}

export async function GET() {
  try {
    // A generous window: recent past (for the current month grid) through the
    // next ~18 months.
    const from = new Date(Date.now() - 90 * 86400000).toISOString();
    const to = new Date(Date.now() + 550 * 86400000).toISOString();

    const url =
      `${SUPABASE_URL}/rest/v1/events` +
      `?visibility=eq.public` +
      `&start_at=gte.${encodeURIComponent(from)}` +
      `&start_at=lte.${encodeURIComponent(to)}` +
      `&select=id,title,description,location,start_at,end_at,all_day,kind,link_url` +
      `&order=start_at.asc`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) return Response.json({ events: [] }, { status: 200 });

    const rows = await res.json();
    const events = (rows || []).map((r) => {
      const { date, time } = toDateAndTime(r.start_at, r.all_day);
      return {
        id: r.id,
        title: r.title,
        date,
        time,
        description: r.description || "",
        location: r.location || "",
        link_url: r.link_url || "",
        type: r.kind || "event",
      };
    });

    return Response.json({ events }, { status: 200 });
  } catch {
    // Never break the homepage over the calendar.
    return Response.json({ events: [] }, { status: 200 });
  }
}

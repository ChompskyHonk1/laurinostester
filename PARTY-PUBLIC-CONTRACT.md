# Party & catering — public routes contract

The `/parties` page on **laurinostavern.com** talks to the Supabase edge function
`drawer-auth` (owned by the dashboard repo, not this one). This file is the contract
between the two sides: the exact request and response shape for the three public routes.

All three routes go through a **single endpoint** with a `route` field in the JSON body:

```
POST {SUPABASE_URL}/functions/v1/drawer-auth
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}
Authorization: Bearer {SUPABASE_ANON_KEY}
```

The browser ships only `SUPABASE_URL` and `SUPABASE_ANON_KEY` — never the service role.
The edge function uses the service role server-side to read/write the tables.

## Conventions

- **Money is always integer cents** (`price_cents`, `rate_cents`, `quoted_*_cents`).
  The page converts to dollars for display only.
- **`null` minimum means "ask a manager", never $0.** `fn_room_minimum` returns null when
  a room has no rate for that season. Render it as "Call for pricing", not free.
- Success envelope: `{ "ok": true, "data": { ... } }`.
- Error envelope: `{ "ok": false, "error": "<human message>", "field": "<optional>" }`
  with an appropriate status (422 validation, 429 rate limit, 403 closed, 500 other).
- CORS: allow `https://laurinostavern.com` (and `https://www.laurinostavern.com`),
  plus `OPTIONS` preflight. Known origins only — never `*`.

---

## 1. `party-public-config`

Reads the public menu, rooms, discount tiers and the master switch. No auth.

**Request**

```json
{ "route": "party-public-config" }
```

**Response `data`**

```json
{
  "enabled": false,
  "lead_days": 7,
  "max_guests_web": 120,
  "max_guests_hard": 200,
  "phone": "(508) 896-6135",

  "rooms": [
    { "id": "uuid", "key": "patio", "name": "Patio", "seats": 40, "is_addon": false, "notes": "..." }
  ],

  "menu": [
    {
      "category": "appetizers",
      "items": [
        {
          "id": "uuid",
          "name": "Chicken Wing Tray",
          "description": "Crispy wings tossed in Buffalo, BBQ or sriracha.",
          "size_label": "half pan",
          "price_cents": 9500,
          "unit_label": "serves 12",
          "covers": 12,
          "portions_per_pan": 12,
          "is_market_price": false
        }
      ]
    }
  ],

  "tiers": [
    { "min_guests": 0,   "percent_off": 0,  "label": "Standard" },
    { "min_guests": 25,  "percent_off": 5,  "label": "Party" },
    { "min_guests": 50,  "percent_off": 10, "label": "Event" },
    { "min_guests": 100, "percent_off": 15, "label": "Big Event" }
  ]
}
```

Field sources (dashboard side):

| field | source |
|---|---|
| `enabled` | `app_settings.party_web_enabled` |
| `lead_days` | `app_settings.party_lead_days` |
| `max_guests_web` | `app_settings.party_max_guests_web` |
| `max_guests_hard` | hardcoded `200` (form's hard ceiling) |
| `rooms[]` | `catering_rooms` where `active` (id, key, name, seats, is_addon, notes), ordered by `sort_order` |
| `menu[]` | `v_catering_public`, grouped by `category` (appetizers, salads, entrees, fried, pizza, sandwiches, sides) |
| `tiers[]` | `catering_discount_tiers` ordered by `min_guests` ascending |

`phone` is `(508) 896-6135` (hardcoded; the page has no settings-driven phone).

---

## 2. `party-public-quote`

Recomputes the room minimum, item total, discount and covers estimate server-side.
Read-only, no auth.

**Request**

```json
{
  "route": "party-public-quote",
  "date": "2026-10-11",
  "hour": 18,
  "guests": 40,
  "room_id": "uuid-or-null",
  "items": [ { "id": "uuid", "qty": 2 } ]
}
```

- `hour` is 0–23 (24-hour). The server maps it to the `'day'` / `'night'` daypart.
- `room_id` is null while the customer is still choosing, or for "no room, just food".
- `items` may be empty.

**Response `data`**

```json
{
  "rooms": [
    { "id": "uuid", "key": "patio", "name": "Patio", "seats": 40,
      "available": true, "minimum_cents": 40000 }
  ],

  "minimum_cents": 40000,
  "item_subtotal_cents": 123000,
  "discount_tier": { "min_guests": 25, "percent_off": 5, "label": "Party" },
  "discount_amount_cents": 6150,
  "item_total_cents": 116850,
  "covers_estimate": 34,

  "lead_days": 7,
  "within_lead": false,
  "over_max_guests": false,
  "phone": "(508) 896-6135"
}
```

Field rules:

| field | rule |
|---|---|
| `rooms[]` | every active room, with `available` from `fn_room_available(room_id, date)` and `minimum_cents` from `fn_room_minimum(room_id, date, hour)`. `minimum_cents` is `null` when there is no rate for that season. |
| `minimum_cents` | the selected room's minimum, or `null`/`0` when `room_id` is null. |
| `item_subtotal_cents` | Σ qty × `price_cents` for non-market items. Market-price items add **nothing**. |
| `discount_tier` | highest `catering_discount_tiers` row whose `min_guests ≤ guests` (guest-count based, not spend). |
| `discount_amount_cents` | `item_subtotal_cents × percent_off / 100` (integer, rounded). |
| `item_total_cents` | `item_subtotal_cents − discount_amount_cents`. |
| `covers_estimate` | Σ qty × `covers`. This drives "about N people's worth". |
| `within_lead` | `date − today < lead_days`. The page points at the phone, it does not reject. |
| `over_max_guests` | `guests > max_guests_web`. The page stops quoting and asks them to call. |

---

## 3. `party-public-submit`

Creates the `party_inquiries` row (with `source='web'`) and its `party_order_items`
wish list, then sends the customer confirmation and manager notification.

**Request**

```json
{
  "route": "party-public-submit",
  "name": "Jane Laurino",
  "email": "jane@example.com",
  "phone": "(508) 555-0123",
  "details": "My mother's 80th, she uses a walker — can we have the room near the door?",
  "date": "2026-10-11",
  "hour": 18,
  "end_hour": 21,
  "guests": 40,
  "room_id": "uuid-or-null",
  "items": [ { "id": "uuid", "qty": 2 } ],
  "website": ""
}
```

- `details` is the customer's free-text box — it maps to `party_inquiries.details`
  (NOT NULL, no default).
- `website` is the honeypot. It must be empty; a bot that fills it gets a
  `{ ok: true, data: { status: "received" } }` with **no** side effects.
- `hour` / `end_hour` are 0–23; the server renders them to `party_time` / `end_time`
  as human text (e.g. `"6pm"`, `"9pm"`) — those columns are `text`, not `time`.
- `phone` is optional. When present it is normalised to E.164 (`+1XXXXXXXXXX`); a value
  that can't be normalised is rejected with `field: "phone"` rather than stored broken.

**Server must (guards):**

1. Reject when `party_web_enabled` is false → 403, message shows the phone number.
2. Rate-limit by IP (a handful per hour) via `party_rate_limit` / `fn_party_rate_limit`.
3. Reject dates in the past; guests `< 1` or `> 200`.
4. Validate email format and non-empty name. Normalise `phone` to E.164; reject with
   `field: "phone"` when a supplied number can't be normalised. The phone stays optional.
5. Verify `room_id` exists and `fn_room_available` is true for that date (else 422).
6. **Recompute the quote server-side** — never trust a price or total from the client.
7. Reject unknown `item_id`s.

**Insert `party_inquiries`** with:

| column | value |
|---|---|
| `source` | `'web'` |
| `status` | `'new'` (default) |
| `needs_confirmation` | `true` — **always**, regardless of guest count |
| `customer_name` | `name` (trimmed) |
| `customer_email` | `email` (trimmed, lowercased) |
| `customer_phone` | `phone` (trimmed) |
| `details` | `details` (trimmed) — NOT NULL, required |
| `notes` | null |
| `taken_by_name` | `'Website'` — NOT NULL, required |
| `party_date` | `date` |
| `party_time` | `"6pm"` (from `hour`) |
| `end_time` | `"9pm"` (from `end_hour`) |
| `guest_count` | `guests` |
| `room_id` | `room_id` or null |
| `is_pickup` | `true` when `room_id` is null |
| `is_catering` | `true` when `room_id` is null |
| `quoted_minimum_cents` | recomputed minimum (integer cents) |
| `quoted_items_cents` | recomputed discounted item total (integer cents) |
| `public_ref` | `fn_party_ref()` → `LP-YYMM-XXXX` |

**Insert `party_order_items`** — one row per picked item, copying name and price
(never a join):

| column | value |
|---|---|
| `inquiry_id` | the new row's id |
| `item_id` | the item id |
| `name` | copied `name` |
| `size_label` | copied `size_label` |
| `qty` | the picked quantity |
| `unit_label` | copied `unit_label` |
| `price_cents` | copied `price_cents` (null = market price) |
| `covers_each` | copied `covers` |

**Email** — two sends, each stamped independently (only after that send returns ok):

1. Customer confirmation, From `Laurino's Events <events@laurinos.online>`.
   Copy must be blunt — it is **not** a booking:

   > **We've got it.** Your request for Saturday 11 October, 6pm, 40 guests — reference
   > LP-2610-A3F9. **This isn't booked yet.** One of us will call you within a day to go
   > through the details and confirm. Questions? (508) 896-6135.

2. Manager notification to `party_recipients` (de-duplicated by email and phone,
   resolving `employee_id` → `employees` contact details at send time).

**Texts** — when `party_sms_enabled` is on, submit also texts. The guest gets a
"request received — we'll call to confirm" message (never a booking) when their number
normalises; every `party_recipients` phone gets the one-line staff alert. Every attempt
is written to `sms_log` with `purpose` and `party_id`, success or failure.

**Response**

```json
{ "ok": true, "data": { "reference": "LP-2610-A3F9", "status": "new" } }
```

---

## 4. `contact-public-submit`

The general website contact form (Support page). **Email only** — a general enquiry
isn't time-critical the way a party is, so it never texts. The message is stored and the
sender gets an auto-reply.

**Request**

```json
{
  "route": "contact-public-submit",
  "name": "Jane Laurino",
  "email": "jane@example.com",
  "phone": "(508) 555-0123",
  "subject": "Reservation Help",
  "message": "Do you take reservations for 12?",
  "website": ""
}
```

- `phone` optional; normalised like the party form, rejected with `field: "phone"`.
- `website` is the honeypot; a non-empty value gets a fake success with no side effects.

**Server must:**

1. Rate-limit by IP (same `fn_party_rate_limit`).
2. Validate name, email format and a non-empty message.
3. Insert `contact_inquiries` (`status='new'`, `source='web'`).
4. Email `party_recipients` (de-duplicated, `employee_id` → `employees` at send time) —
   email only.
5. Auto-reply to the sender: "Thanks for reaching out — we've got your message and someone
   will be back to you soon. If it's urgent, call us at (508) 896-6135."

**Response**

```json
{ "ok": true, "data": { "status": "received" } }
```

Owner routes `inquiry-list` and `inquiry-mark-handled` back the dashboard Inquiries screen.

---

## Dependency (dashboard side)

The submit route's rate-limit uses `public.party_rate_limit` + `fn_party_rate_limit`.
Apply `party-rate-limit.sql` (in this repo) to the shared database before going live.

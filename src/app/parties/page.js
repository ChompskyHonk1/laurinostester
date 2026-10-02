"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { getConfig, getQuote, submitParty } from "./partyApi";
import { normalisePhone } from "../utils/phone";

// The 3D chafing-dish viewer is heavy, so it is code-split and loaded
// client-side only (WebGL needs the DOM).
const ChaferViewer = dynamic(() => import("./ChaferViewer"), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

const PHONE = "(508) 896-6135";
const FALLBACK_IMG = "/Pizza.png";

// In-progress party plans are saved here so a reload or an accidental
// navigation away doesn't lose them. Cleared once a request is submitted.
const PARTY_DRAFT_KEY = "laurinos.partyDraft.v1";

/* ------------------------------------------------------------------ helpers */

function fmtCents(cents) {
  if (cents == null) return "";
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? "$" + dollars.toLocaleString("en-US")
    : "$" + dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function prettyDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function prettyHour(hour) {
  const h = ((hour % 24) + 24) % 24;
  const period = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${period}`;
}

// catering_rooms has no image column, so room images are mapped locally by `key`
// (with a name-based fallback in case the keys differ). Menu images are mapped by
// category — the DB has no per-item photos.
const ROOM_IMAGES = {
  "dining-front": "/parties/room-dining.jpg",
  "dining-back": "/parties/room-private.jpg",
  atrium: "/parties/room-private.jpg",
  patio: "/parties/room-patio.jpg",
  "outside-bar": "/parties/room-bar.jpg",
};

const CATEGORY_IMAGES = {
  appetizers: "/parties/food-wings.jpg",
  salads: "/parties/food-salad.jpg",
  entrees: "/parties/food-grill.jpg",
  fried: "/FishandChips.jpg",
  pizza: "/Pizza.png",
  sandwiches: "/Burger.jpg",
  sides: "/parties/food-apps.jpg",
  // Drinks show a metal pitcher rather than the generic pizza fallback.
  drinks: "/parties/food/drink-iced-tea.svg",
};

// Per-item photos. Keys are a normalized slug of the item name (see itemSlug
// below). Large/small pizza sizes and the two fry sides share one image each.
const ITEM_IMAGES = {
  // fried
  "fried-shrimp": "/parties/food/fried-shrimp.jpg",
  "fish-chips": "/parties/food/fish-chips.jpg",
  "chicken-finger-platter": "/parties/food/chicken-finger-platter.jpg",
  "fried-scallop-platter": "/parties/food/fried-scallop-platter.jpg",
  // pizza
  "cheese-pizza": "/parties/food/cheese-pizza.jpg",
  "meat-lovers": "/parties/food/meat-lovers.jpg",
  "vegetarian": "/parties/food/vegetarian.jpg",
  "buffalo-chicken": "/parties/food/buffalo-chicken.jpg",
  "the-greek": "/parties/food/the-greek.jpg",
  "pesto-lovers": "/parties/food/pesto-lovers.jpg",
  "kitchen-sink": "/parties/food/kitchen-sink.jpg",
  "tubbys-pie": "/parties/food/tubbys-pie.jpg",
  "the-big-mac": "/parties/food/the-big-mac.jpg",
  // salads
  "house-salad": "/parties/food/house-salad.jpg",
  "caesar-salad": "/parties/food/caesar-salad.jpg",
  "brewster-salad": "/parties/food/brewster-salad.jpg",
  "greek-salad": "/parties/food/greek-salad.jpg",
  "clam-chowder": "/parties/food/clam-chowder.jpg",
  "french-onion-soup": "/parties/food/french-onion-soup.jpg",
  // entrees
  "chicken-parmesan": "/parties/food/chicken-parmesan.jpg",
  "eggplant-parmesan": "/parties/food/eggplant-parmesan.jpg",
  "meatballs": "/parties/food/meatballs.jpg",
  "chicken-carbonara": "/parties/food/chicken-carbonara.jpg",
  "chicken-piccata": "/parties/food/chicken-piccata.jpg",
  "baked-cod": "/parties/food/baked-cod.jpg",
  "grilled-salmon": "/parties/food/grilled-salmon.jpg",
  "shrimp-scampi": "/parties/food/shrimp-scampi.jpg",
  "lobster-mac-and-cheese": "/parties/food/lobster-mac-and-cheese.jpg",
  "grilled-bourbon-steak-tips": "/parties/food/grilled-bourbon-steak-tips.jpg",
  "ribeye": "/parties/food/ribeye.jpg",
  "pan-seared-scallops": "/parties/food/pan-seared-scallops.jpg",
  "mussels-over-pasta": "/parties/food/mussels-over-pasta.jpg",
  // appetizers
  "cod-bites": "/parties/food/cod-bites.jpg",
  "quahog": "/parties/food/quahog.jpg",
  "chicken-wings": "/parties/food/chicken-wings.jpg",
  "garlic-bread": "/parties/food/garlic-bread.jpg",
  "garlic-bread-with-cheese": "/parties/food/garlic-bread-with-cheese.jpg",
  "sandbar-skins": "/parties/food/sandbar-skins.jpg",
  "fries": "/parties/food/fries.jpg",
  "oysters": "/parties/food/oysters.jpg",
  // sides
  "side-salad": "/parties/food/side-salad.jpg",
  "onion-rings": "/parties/food/onion-rings.jpg",
  "vegetable-of-the-day": "/parties/food/vegetable-of-the-day.jpg",
  // sandwiches
  "italian-cold-cut": "/parties/food/italian-cold-cut.jpg",
  "chicken-parmesan-grinder": "/parties/food/chicken-parmesan-grinder.jpg",
  "sliced-meatball": "/parties/food/sliced-meatball.jpg",
  "eggplant-parmesan-grinder": "/parties/food/eggplant-parmesan-grinder.jpg",
  "italian-ground-sausage": "/parties/food/italian-ground-sausage.jpg",
  "philly-cheese-sub": "/parties/food/philly-cheese-sub.jpg",
  "roast-beef-grinder": "/parties/food/roast-beef-grinder.jpg",
  // drinks — one metal pitcher per beverage, coloured to match
  "iced-tea-urn": "/parties/food/drink-iced-tea.svg",
  "lemonade-urn": "/parties/food/drink-lemonade.svg",
  "coffee-urn": "/parties/food/drink-coffee.svg",
  "water-service": "/parties/food/drink-water.svg",
};

function itemSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function roomImage(room) {
  if (room.key && ROOM_IMAGES[room.key]) return ROOM_IMAGES[room.key];
  const name = (room.name || "").toLowerCase();
  if (name.includes("patio")) return "/parties/room-patio.jpg";
  if (name.includes("bar")) return "/parties/room-bar.jpg";
  if (name.includes("atrium")) return "/parties/room-private.jpg";
  if (name.includes("back")) return "/parties/room-private.jpg";
  if (name.includes("front")) return "/parties/room-dining.jpg";
  return FALLBACK_IMG;
}

function itemImage(item) {
  return ITEM_IMAGES[itemSlug(item.name)] || CATEGORY_IMAGES[item.category] || FALLBACK_IMG;
}

// Items actually served in chafing dishes. Cold bar items (soups, raw
// oysters) are left out; salads do go in trays.
const TRAY_CATEGORIES = new Set(["fried", "entrees", "appetizers", "sides", "salads"]);
const TRAY_EXCLUDE = new Set(["clam-chowder", "french-onion-soup", "oysters"]);

// Full-tray capacity per item, in that item's menu units. A half tray holds
// half this amount. Anything not listed falls back to the default.
const TRAY_CAPACITY = {
  "cod-bites": 13,
  "house-salad": 5,
  "caesar-salad": 5,
  "brewster-salad": 5,
  "greek-salad": 5,
  "side-salad": 5,
  "chicken-parmesan": 12,
  "eggplant-parmesan": 12,
  "grilled-salmon": 12,
  "baked-cod": 12,
  "chicken-piccata": 12,
  "shrimp-scampi": 12,
  "garlic-bread": 12,
  "garlic-bread-with-cheese": 12,
  "grilled-bourbon-steak-tips": 12,
  // Fried platters: ~3 fill a half tray, ~8 a full tray.
  "fried-shrimp": { full: 8, half: 3 },
  "fish-chips": { full: 8, half: 3 },
  "chicken-finger-platter": { full: 8, half: 3 },
  "fried-scallop-platter": { full: 8, half: 3 },
  meatballs: 4,
  "chicken-carbonara": 6,
  "lobster-mac-and-cheese": 8,
  ribeye: 8,
  "pan-seared-scallops": 8,
  "mussels-over-pasta": 8,
  quahog: 12,
  "chicken-wings": 6,
  "sandbar-skins": 6,
  fries: 4,
  "onion-rings": 6,
  "vegetable-of-the-day": 8,
};
const DEFAULT_TRAY_CAPACITY = 8;

function isTrayItem(item) {
  return TRAY_CATEGORIES.has(item.category) && !TRAY_EXCLUDE.has(itemSlug(item.name));
}

function trayCapacity(item) {
  const c = TRAY_CAPACITY[itemSlug(item.name)];
  if (typeof c === "number") return { full: c, half: c / 2 };
  if (c) return { full: c.full, half: c.half ?? c.full / 2 };
  return { full: DEFAULT_TRAY_CAPACITY, half: DEFAULT_TRAY_CAPACITY / 2 };
}

// Entrées that come with a plated side. On larger orders the side is served in
// its own tray, so the viewer shows it separately too.
const SIDE_IMAGES = {
  rice: "/parties/food/side-rice.jpg",
  mashed: "/parties/food/side-mashed-potatoes.jpg",
};

const ITEM_SIDES = {
  "grilled-salmon": { image: SIDE_IMAGES.rice, label: "Rice" },
  "baked-cod": { image: SIDE_IMAGES.rice, label: "Rice" },
  "chicken-piccata": { image: SIDE_IMAGES.rice, label: "Rice" },
  "grilled-bourbon-steak-tips": { image: SIDE_IMAGES.mashed, label: "Mashed potatoes" },
  ribeye: { image: SIDE_IMAGES.mashed, label: "Mashed potatoes" },
  "pan-seared-scallops": { image: SIDE_IMAGES.mashed, label: "Mashed potatoes" },
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatches(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return matches;
}

// Shared tablecloth swatch buttons (used in Step 2 and under the 3D builder).
function ClothChoices({ value, onChange }) {
  return (
    <ClothOptions>
      {TABLECLOTHS.map((tc) => (
        <button
          key={tc.id}
          type="button"
          className="tc-opt"
          data-active={value === tc.id}
          aria-pressed={value === tc.id}
          onClick={() => onChange(tc.id)}
        >
          <span className="tc-swatch" style={{ background: tc.swatch }} />
          <span className="tc-text">
            <strong>{tc.name}</strong>
            <em>{tc.note}</em>
          </span>
        </button>
      ))}
    </ClothOptions>
  );
}

// One soda pitcher's worth: 32 oz, a flat price, and a gun flavor. Counts are
// per flavor so a mixed order stays one compact picker, never menu line items.
function PitcherPicker({ value, onQty, count, cents }) {
  return (
    <PitcherBox>
      <div className="pb-head">
        <span>32 oz · {fmtCents(PITCHER_CENTS)} each · serves 2–3</span>
        {count > 0 && (
          <strong>
            {count} · {fmtCents(cents)}
          </strong>
        )}
      </div>
      <div className="pb-flavors">
        {SOFT_DRINKS.map((d) => {
          const qty = value[d.id] || 0;
          return (
            <div className="pb-row" key={d.id}>
              <span className="pb-name">
                <i style={{ background: d.color }} aria-hidden="true" />
                {d.name}
              </span>
              <Stepper>
                <StepBtn
                  type="button"
                  onClick={() => onQty(d.id, -1)}
                  aria-label={`Remove ${d.name} pitcher`}
                  disabled={!qty}
                >
                  −
                </StepBtn>
                <Qty>{qty}</Qty>
                <StepBtn
                  type="button"
                  onClick={() => onQty(d.id, 1)}
                  aria-label={`Add ${d.name} pitcher`}
                  disabled={count >= PITCHER_MAX}
                >
                  +
                </StepBtn>
              </Stepper>
            </div>
          );
        })}
      </div>
      {count > 0 && <p className="pb-serves">Serves about {Math.round(count * 2.5)} people.</p>}
      {count >= 8 && (
        <p className="pb-note">
          That&apos;s a lot of pitchers. An urn serves 15–20 for one price — tell us and
          we&apos;ll swap a few.
        </p>
      )}
      {count >= PITCHER_MAX && (
        <p className="pb-note">Twelve is the most we take online — call us for a bigger pour.</p>
      )}
      <p className="pb-plain">
        <strong>Starry is our lemon-lime</strong> — it&apos;s what we pour when someone asks for
        Sprite. We&apos;re a Pepsi house. Guests ask for Sprite and Coke by name, and it&apos;s
        better they know now than on the night.
      </p>
    </PitcherBox>
  );
}

// The slider thumb: a martini glass that fills with a blue drink as the open
// bar budget rises. `pct` is 0..1.
function MartiniGlass({ pct }) {
  const uid = useId();
  const p = Math.max(0, Math.min(1, pct || 0));
  const bowlTop = 7;
  const bowlH = 17;
  const clipId = `martini-bowl-${uid}`;
  const drinkId = `martini-drink-${uid}`;
  const shift = (1 - p) * bowlH;
  const bowl = `M7 ${bowlTop} H37 L22 ${bowlTop + bowlH} Z`;
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d={bowl} />
        </clipPath>
        <linearGradient id={drinkId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f2" />
          <stop offset="100%" stopColor="#2f7fb5" />
        </linearGradient>
      </defs>
      <path d={bowl} fill="#ffffff" />
      <g clipPath={`url(#${clipId})`}>
        <g style={{ transform: `translateY(${shift}px)`, transition: "transform 160ms ease-out" }}>
          <rect x="0" y={bowlTop} width="44" height={bowlH} fill={`url(#${drinkId})`} />
        </g>
      </g>
      <path d={bowl} fill="none" stroke="#3A5666" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M22 ${bowlTop + bowlH} V37`} stroke="#3A5666" strokeWidth="2" />
      <path d="M14 39 H30" stroke="#3A5666" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="11" r="2.6" fill="#8B7355" />
    </svg>
  );
}

// In-house bar + drinks picker. Bar mode is a dropdown; an open bar reveals the
// martini-glass budget slider and the pour package.
function DrinksPicker({
  barMode,
  onBarMode,
  barBudgetCents,
  onBarBudget,
  barPackage,
  onBarPackage,
  sodaPitchers,
  onPitcherQty,
  pitcherCount,
  pitcherCents,
}) {
  const pkg = BAR_PACKAGES.find((p) => p.id === barPackage) || BAR_PACKAGES[0];
  const barPct = (barBudgetCents - BAR_MIN_CENTS) / (BAR_MAX_CENTS - BAR_MIN_CENTS);
  return (
    <DrinksPanel>
      <h4>Bar &amp; drinks</h4>
      <p className="dp-intro">
        Host the bar, let guests run their own tab, or add soda pitchers for the table.
      </p>

      <Field>
        <label htmlFor="party-bar">Bar service</label>
        <Select id="party-bar" value={barMode} onChange={(e) => onBarMode(e.target.value)}>
          <option value="none">No hosted bar</option>
          <option value="cash">Cash bar — guests pay their own</option>
          <option value="open">Open bar — you set the tab</option>
        </Select>
      </Field>

      {barMode === "open" && (
        <OpenBar>
          <div className="ob-top">
            <span>Open bar budget</span>
            <strong>{fmtCents(barBudgetCents)}</strong>
          </div>
          <SliderWrap>
            <BarRange
              min={BAR_MIN_CENTS}
              max={BAR_MAX_CENTS}
              step={BAR_STEP_CENTS}
              value={barBudgetCents}
              onChange={(e) => onBarBudget(parseInt(e.target.value, 10))}
              aria-label="Open bar budget"
            />
            <MartiniThumb style={{ left: `calc(${barPct * 100}% + ${(0.5 - barPct) * 40}px)` }}>
              <MartiniGlass pct={barPct} />
            </MartiniThumb>
          </SliderWrap>
          <div className="ob-scale">
            <span>{fmtCents(BAR_MIN_CENTS)}</span>
            <span>{fmtCents(BAR_MAX_CENTS)}</span>
          </div>
          <Field>
            <label htmlFor="party-bar-package">What we pour</label>
            <Select id="party-bar-package" value={barPackage} onChange={(e) => onBarPackage(e.target.value)}>
              {BAR_PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <p className="bar-note">
            A hosted tab up to {fmtCents(barBudgetCents)} for {pkg.name.toLowerCase()}. A manager
            confirms the pour list with you.
          </p>
        </OpenBar>
      )}

      {barMode === "cash" && (
        <p className="bar-note">
          A cash bar adds nothing to your estimate — guests pay for their own drinks at the bar.
        </p>
      )}

      <PitcherPicker
        value={sodaPitchers}
        onQty={onPitcherQty}
        count={pitcherCount}
        cents={pitcherCents}
      />
    </DrinksPanel>
  );
}

const HOURS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const DURATIONS = [2, 3, 4, 5];

// In-house tablecloth options. "wood" means bare tables, no charge.
const TABLECLOTHS = [
  { id: "wood", name: "No tablecloth", note: "Bare wood", swatch: "linear-gradient(135deg,#a9763f,#7c4f26)", priceCents: 0 },
  { id: "black", name: "Black", note: "+$4", swatch: "#1b1b1d", priceCents: 400 },
  { id: "white", name: "White", note: "+$4", swatch: "#efece4", priceCents: 400 },
  { id: "navy", name: "Navy blue", note: "+$4", swatch: "#3A5666", priceCents: 400 },
];

// In-house bar service. A cash bar costs the host nothing; an open bar is a
// hosted tab the host caps with the slider. Prices stay client-side (the server
// quote has no drink line yet) and are appended to the request notes on submit.
const BAR_MIN_CENTS = 3000; // $30
const BAR_MAX_CENTS = 400000; // $4,000
const BAR_STEP_CENTS = 1000; // $10
const BAR_DEFAULT_CENTS = 30000; // $300

const BAR_PACKAGES = [
  { id: "beer_wine", name: "Beer & wine", short: "Beer & wine" },
  { id: "full", name: "Beer, wine & liquor", short: "Full bar" },
];

// Soda pitchers are the only drinks modeled in 3D (no alcohol rendering).
// One pitcher is 32 oz and stays a flat $9.75 — a real price that counts toward
// the total and the room minimum. Flavors come off the gun.
const PITCHER_CENTS = 975; // $9.75 each
const PITCHER_MAX = 12;
const PITCHER_PEOPLE = 2.5; // average people served per pitcher

const SOFT_DRINKS = [
  { id: "pepsi", name: "Pepsi", color: "#4a2c18" },
  { id: "diet-pepsi", name: "Diet Pepsi", color: "#5a4632" },
  { id: "starry", name: "Starry", color: "#c8d24a" },
  { id: "mountain-dew", name: "Mountain Dew", color: "#bcd93a" },
  { id: "ginger-ale", name: "Ginger ale", color: "#d9a437" },
  { id: "pink-lemonade", name: "Pink lemonade", color: "#e0788f" },
  { id: "hi-c", name: "Hi-C", color: "#e2841f" },
];

// Catering menu items we never show. The kegs are off for now.
const HIDDEN_MENU_ITEMS = new Set(["half-keg", "sixth-barrel"]);

// Soft drinks belong at the end of the drinks section, after beer and wine.
const SOFT_DRINK_WORDS = [
  "soda",
  "pepsi",
  "starry",
  "dew",
  "ginger ale",
  "lemonade",
  "hi-c",
  "tea",
  "coffee",
  "water",
  "seltzer",
];

function isSoftDrinkName(name) {
  const n = (name || "").toLowerCase();
  return SOFT_DRINK_WORDS.some((w) => n.includes(w));
}

function orderDrinks(items) {
  const soft = [];
  const rest = [];
  for (const it of items) (isSoftDrinkName(it.name) ? soft : rest).push(it);
  return [...rest, ...soft];
}

/* -------------------------------------------------------------- api client */
/* (imported above)                                                          */

/* ------------------------------------------------------------------- page */

export default function PartiesPage() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);

  const [date, setDate] = useState(todayISO(7));
  const [hour, setHour] = useState(18);
  const [duration, setDuration] = useState(3);
  const [guests, setGuests] = useState("");

  const [roomIds, setRoomIds] = useState([]); // selected room ids (multi-select)
  const [noRoom, setNoRoom] = useState(false); // catering pickup, exclusive with rooms
  const [items, setItems] = useState({}); // itemId -> qty

  const [chaferOpen, setChaferOpen] = useState(false); // mobile 3D overlay
  const [mounted, setMounted] = useState(false);
  const [tablecloth, setTablecloth] = useState("wood"); // wood | black | white | navy
  const [barMode, setBarMode] = useState("none"); // none | cash | open
  const [barBudgetCents, setBarBudgetCents] = useState(BAR_DEFAULT_CENTS);
  const [barPackage, setBarPackage] = useState("beer_wine"); // beer_wine | full
  const [sodaPitchers, setSodaPitchers] = useState({}); // flavorId -> qty
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => setMounted(true), []);

  // Catering pickup (no room) never has tablecloths or a hosted bar.
  useEffect(() => {
    if (noRoom) {
      setTablecloth("wood");
      setBarMode("none");
      setSodaPitchers({});
    }
  }, [noRoom]);

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [contact, setContact] = useState({ name: "", email: "", phone: "", details: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(null); // { reference }

  const quoteTimer = useRef(null);
  const draftApplied = useRef(false);

  // Restore an in-progress plan from localStorage, once. Runs after the config
  // (and its default date) is set, so the saved values win. Everything the
  // visitor typed — guests, room, menu, drinks, contact, even the step they
  // were on — comes back exactly as they left it.
  const applyDraft = useCallback(() => {
    if (draftApplied.current) return;
    draftApplied.current = true;
    if (typeof window === "undefined") return;
    let raw = null;
    try {
      raw = window.localStorage.getItem(PARTY_DRAFT_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let d = null;
    try {
      d = JSON.parse(raw);
    } catch {
      return;
    }
    if (!d || d.v !== 1) return;
    if (typeof d.step === "number") setStep(Math.min(3, Math.max(0, d.step)));
    if (typeof d.date === "string" && d.date) setDate(d.date);
    if (typeof d.hour === "number") setHour(d.hour);
    if (typeof d.duration === "number") setDuration(d.duration);
    if (typeof d.guests === "string") setGuests(d.guests);
    if (Array.isArray(d.roomIds)) setRoomIds(d.roomIds);
    if (typeof d.noRoom === "boolean") setNoRoom(d.noRoom);
    // Back-compat with the older single-choice draft shape.
    if (d.roomChoice !== undefined && !Array.isArray(d.roomIds)) {
      if (d.roomChoice === "none") {
        setNoRoom(true);
      } else if (d.roomChoice) {
        setRoomIds([d.roomChoice]);
      }
    }
    if (d.items && typeof d.items === "object") setItems(d.items);
    if (typeof d.tablecloth === "string") setTablecloth(d.tablecloth);
    if (typeof d.barMode === "string") setBarMode(d.barMode);
    if (typeof d.barBudgetCents === "number") setBarBudgetCents(d.barBudgetCents);
    if (typeof d.barPackage === "string") setBarPackage(d.barPackage);
    if (d.sodaPitchers && typeof d.sodaPitchers === "object") setSodaPitchers(d.sodaPitchers);
    if (d.contact && typeof d.contact === "object") {
      setContact((prev) => ({ ...prev, ...d.contact }));
    }
  }, []);

  /* ---- load config (retryable) ---- */
  const loadConfig = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    getConfig()
      .then((r) => {
        setConfig(r.data);
        setDate(todayISO(r.data.lead_days ?? 7));
        applyDraft();
      })
      .catch((e) => {
        // Keep the human-facing panel simple, but leave the real cause in the
        // console so a blocked request or cold start can actually be diagnosed.
        console.error("Party config failed to load:", e);
        setLoadError(e.message || "Could not load party details");
      })
      .finally(() => setLoading(false));
  }, [applyDraft]);

  // Persist the draft on every meaningful change so nothing is lost if the
  // visitor navigates away or reloads. Skipped after a successful submit.
  useEffect(() => {
    if (!config || submitted) return;
    const draft = {
      v: 1,
      step,
      date,
      hour,
      duration,
      guests,
      roomIds,
      noRoom,
      items,
      tablecloth,
      barMode,
      barBudgetCents,
      barPackage,
      sodaPitchers,
      contact,
      savedAt: Date.now(),
    };
    try {
      window.localStorage.setItem(PARTY_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable (private mode) — remembering is best-effort */
    }
  }, [
    config,
    submitted,
    step,
    date,
    hour,
    duration,
    guests,
    roomIds,
    noRoom,
    items,
    tablecloth,
    barMode,
    barBudgetCents,
    barPackage,
    sodaPitchers,
    contact,
  ]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  /* ---- debounced quote ---- */
  const roomIdForQuote = roomIds[0] || null;
  const guestsInt = parseInt(guests, 10) || 0;

  useEffect(() => {
    if (!config || !date || hour == null) return;
    const payload = {
      date,
      hour,
      guests: guestsInt,
      room_id: roomIdForQuote,
      items: Object.entries(items)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ id, qty })),
    };
    if (quoteTimer.current) clearTimeout(quoteTimer.current);
    setQuoteLoading(true);
    quoteTimer.current = setTimeout(() => {
      getQuote(payload)
        .then((r) => setQuote(r.data))
        .catch(() => setQuote(null))
        .finally(() => setQuoteLoading(false));
    }, 250);
    return () => clearTimeout(quoteTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, date, hour, guestsInt, roomIdForQuote, items]);

  /* ---- derived ---- */
  const q = quote;
  const rooms = (q && q.rooms) || [];
  const availableRooms = rooms.filter((r) => r.available);
  const selectedRooms = rooms.filter((r) => roomIds.includes(r.id));
  const selectedRoom = selectedRooms[0] || null;
  // Display label for the summary and confirmation — multiple rooms join with " + ".
  const roomLabel = noRoom
    ? "No room (pickup)"
    : selectedRooms.length
    ? selectedRooms.map((r) => r.name).join(" + ")
    : "—";
  const minimumCents = q && q.minimum_cents != null ? q.minimum_cents : null;
  const itemSubtotalCents = q ? q.item_subtotal_cents : 0;
  const itemTotalCents = q ? q.item_total_cents : 0;
  const coversEstimate = q ? Math.round(q.covers_estimate || 0) : 0;
  const withinLead = q ? q.within_lead : false;
  const overMaxGuests = q ? q.over_max_guests : false;

  const inHouse = roomIds.length > 0;
  const selectedCloth = TABLECLOTHS.find((t) => t.id === tablecloth) || TABLECLOTHS[0];
  const clothCents = inHouse ? selectedCloth.priceCents : 0;
  const selectedBarPackage = BAR_PACKAGES.find((p) => p.id === barPackage) || BAR_PACKAGES[0];
  const barCents = inHouse && barMode === "open" ? barBudgetCents : 0;

  const pitcherLines = SOFT_DRINKS.map((d) => ({ ...d, qty: sodaPitchers[d.id] || 0 }));
  const pitcherCount = pitcherLines.reduce((a, d) => a + d.qty, 0);
  const pitcherCents = inHouse ? pitcherCount * PITCHER_CENTS : 0;
  const pitcherColors = useMemo(() => {
    const out = [];
    for (const d of SOFT_DRINKS) {
      const qty = sodaPitchers[d.id] || 0;
      for (let i = 0; i < qty; i++) out.push(d.color);
    }
    return out;
  }, [sodaPitchers]);

  const drinkCents = barCents + pitcherCents;
  // Soft drinks and a hosted bar are food & drink spend, so they count toward
  // the room minimum. Tablecloths are a rental and do not.
  const spendCents = itemTotalCents + drinkCents;
  const displayedTotalCents = spendCents + clothCents;
  const barSummary =
    barMode === "open"
      ? `Open bar · ${selectedBarPackage.short} +${fmtCents(barBudgetCents)}`
      : barMode === "cash"
      ? "Cash bar"
      : "None";

  // Selected items that belong in chafing dishes, in menu order.
  const trayItems = useMemo(() => {
    if (!config?.menu) return [];
    const out = [];
    for (const group of config.menu) {
      for (const item of group.items) {
        const qty = items[item.id] || 0;
        if (qty > 0 && isTrayItem(item)) {
          out.push({
            id: item.id,
            name: item.name,
            image: itemImage(item),
            qty,
            perTray: trayCapacity(item),
            side: ITEM_SIDES[itemSlug(item.name)] || null,
          });
        }
      }
    }
    return out;
  }, [config, items]);

  const detailsValid = Boolean(date && hour != null && guestsInt >= 1 && guestsInt <= (config?.max_guests_hard ?? 200));
  const roomValid = noRoom || roomIds.length > 0;
  const phoneInput = contact.phone.trim();
  const phoneValid = !phoneInput || normalisePhone(phoneInput) !== null;
  const contactValid = Boolean(
    contact.name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) &&
      phoneValid
  );

  const setQty = useCallback((id, delta) => {
    setItems((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }, []);

  const setPitcherQty = useCallback((flavorId, delta) => {
    setSodaPitchers((prev) => {
      const total = Object.values(prev).reduce((a, b) => a + b, 0);
      if (delta > 0 && total >= PITCHER_MAX) return prev;
      const next = Math.max(0, (prev[flavorId] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[flavorId];
      else copy[flavorId] = next;
      return copy;
    });
  }, []);

  // Rooms are multi-select: adding one never replaces the others. Picking a
  // room clears "no room"; picking "no room" clears every room.
  const toggleRoom = useCallback((id) => {
    setNoRoom(false);
    setRoomIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const chooseNoRoom = useCallback(() => {
    setNoRoom(true);
    setRoomIds([]);
  }, []);

  const canNext = (s) => {
    if (s === 0) return detailsValid;
    if (s === 1) return roomValid;
    if (s === 2) return true; // menu optional
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (overMaxGuests || submitting) return;
    if (!phoneValid) {
      setSubmitError(
        "That phone number doesn't look right — use 10 digits, e.g. (508) 555-0123."
      );
      return;
    }
    if (!contactValid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const clothNote = inHouse
        ? `Tablecloths: ${selectedCloth.name}${selectedCloth.priceCents ? ` (+${fmtCents(selectedCloth.priceCents)})` : ""}`
        : "";
      // All chosen rooms go in the note; room_id stays the primary (first)
      // room for the server model, and a manager confirms the combination.
      const roomNote = inHouse
        ? `Rooms: ${selectedRooms.map((r) => r.name).join(", ")}`
        : noRoom
        ? "Room: None — catering pickup"
        : "";
      const barNote =
        inHouse && barMode === "open"
          ? `Bar: Open bar — ${selectedBarPackage.name} — ${fmtCents(barBudgetCents)} tab`
          : inHouse && barMode === "cash"
          ? "Bar: Cash bar (guests pay their own)"
          : "";
      const pitcherNote =
        inHouse && pitcherCount > 0
          ? `Soda pitchers (32 oz, ${fmtCents(PITCHER_CENTS)} each): ${pitcherLines
              .filter((d) => d.qty > 0)
              .map((d) => `${d.qty} ${d.name}`)
              .join(", ")} — ${fmtCents(pitcherCents)}`
          : "";
      const payload = {
        name: contact.name,
        email: contact.email,
        phone: normalisePhone(contact.phone) || "",
        details: [contact.details, roomNote, clothNote, barNote, pitcherNote].filter(Boolean).join("\n\n"),
        website: contact.website,
        date,
        hour,
        end_hour: (hour + duration) % 24,
        guests: guestsInt,
        room_id: roomIdForQuote,
        items: Object.entries(items)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => ({ id, qty })),
      };
      const r = await submitParty(payload);
      if (r.ok) {
        setSubmitted({ reference: r.data.reference });
        // The plan is in — don't restore it next visit.
        try {
          window.localStorage.removeItem(PARTY_DRAFT_KEY);
        } catch {
          /* ignore */
        }
        draftApplied.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(r.error || "Could not send your request.");
      }
    } catch (err) {
      setSubmitError(err.message || "Could not send your request.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- render states ---- */
  if (loading) {
    return (
      <Page>
        <Loading>
          <Spinner />
          <p>Getting the party started…</p>
        </Loading>
      </Page>
    );
  }

  if (loadError) {
    return (
      <Page>
        <ClosedPanel>
          <h1>Party requests</h1>
          <p>
            We couldn&apos;t load party details right now. Please try again, or give us a
            call at {PHONE}.
          </p>
          <RetryButton type="button" onClick={loadConfig}>
            Try again
          </RetryButton>
        </ClosedPanel>
      </Page>
    );
  }

  if (!config.enabled) {
    return (
      <Page>
        <Hero $slim>
          <h1>Plan a private party</h1>
        </Hero>
        <ClosedPanel>
          <h2>Party requests are currently closed</h2>
          <p>
            We&apos;re not taking online party requests right now. Call us at{" "}
            <a href="tel:+15088966135">{config.phone || PHONE}</a> and we&apos;ll help you
            plan something.
          </p>
        </ClosedPanel>
      </Page>
    );
  }

  if (submitted) {
    return <Confirmation reference={submitted.reference} date={date} hour={hour} guests={guestsInt} roomName={roomLabel === "—" ? undefined : roomLabel} phone={config.phone} />;
  }

  return (
    <Page>
      <Hero>
        <div className="hero-inner">
          <h1>Plan a private party</h1>
          <p>
            Browse the rooms, build a catering wish list, and send us a request. No
            payment up front — a manager calls you back to confirm.
          </p>
          <a href="tel:+15088966135" className="hero-phone">
            Or call {config.phone || PHONE}
          </a>
        </div>
      </Hero>

      <StepperNav>
        {STEPS.map((s, i) => (
          <StepDot key={s} $active={i <= step} onClick={() => i < step && setStep(i)} aria-label={s}>
            <span className="dot" />
            <span className="label">{s}</span>
          </StepDot>
        ))}
      </StepperNav>

      <Layout>
        <Main>
          {/* Step 1 — details */}
          <Step $active={step === 0}>
            <StepHeader>
              <StepNum>1</StepNum>
              <div>
                <h2>Date, time &amp; headcount</h2>
                <p>Tell us when and how many.</p>
              </div>
            </StepHeader>

            {withinLead && guestsInt > 0 && (
              <Notice $tone="warn">
                <strong>That&apos;s short notice for a party</strong> — give us a call at{" "}
                <a href="tel:+15088966135">{config.phone || PHONE}</a> and we&apos;ll see what we
                can do.
              </Notice>
            )}

            {overMaxGuests && (
              <Notice $tone="warn">
                <strong>Over {config.max_guests_web} guests?</strong> A party that size needs a
                conversation, not a form. Call us at{" "}
                <a href="tel:+15088966135">{config.phone || PHONE}</a> and we&apos;ll plan it with you.
              </Notice>
            )}

            <FieldGrid>
              <Field>
                <label htmlFor="party-date">Date</label>
                <input
                  id="party-date"
                  type="date"
                  value={date}
                  min={todayISO(0)}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field>
                <label htmlFor="party-time">Start time</label>
                <Select value={hour} onChange={(e) => setHour(parseInt(e.target.value, 10))}>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {prettyHour(h)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <label htmlFor="party-duration">Rough end time</label>
                <Select value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))}>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      About {d} hours ({prettyHour((hour + d) % 24)})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <label htmlFor="party-guests">Guests</label>
                <input
                  id="party-guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={config.max_guests_hard ?? 200}
                  placeholder="40"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </Field>
            </FieldGrid>
          </Step>

          {/* Step 2 — room */}
          <Step $active={step === 1}>
            <StepHeader>
              <StepNum>2</StepNum>
              <div>
                <h2>Pick your room(s)</h2>
                <p>Tap to add more than one room. Hidden rooms are unavailable for that date.</p>
              </div>
            </StepHeader>

            <RoomGrid>
              <RoomCard
                role="button"
                tabIndex={0}
                $selected={noRoom}
                onClick={chooseNoRoom}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && chooseNoRoom()}
              >
                <div className="room-img room-img--none">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M13 46 h38" strokeLinecap="round" />
                    <path d="M20 46 a12 12 0 0 1 24 0 Z" fill="currentColor" fillOpacity="0.14" />
                    <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="room-body">
                  <h3>No room, just food</h3>
                  <p>Catering pickup — no room needed at all.</p>
                  <div className="room-min">No room minimum</div>
                </div>
                  <CheckMark $visible={noRoom} />
                </RoomCard>

              {availableRooms.map((r) => (
                <RoomCard
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  $selected={roomIds.includes(r.id)}
                  onClick={() => toggleRoom(r.id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleRoom(r.id)}
                >
                  <div className="room-img">
                    <img src={roomImage(r)} alt={r.name} onError={(e) => (e.target.src = FALLBACK_IMG)} />
                  </div>
                  <div className="room-body">
                    <h3>{r.name}</h3>
                    <p>Seats up to {r.seats}</p>
                    <div className="room-min">
                      {r.minimum_cents != null ? (
                        <>
                          <strong>{fmtCents(r.minimum_cents)}/hour</strong> minimum
                        </>
                      ) : (
                        "Call for pricing"
                      )}
                    </div>
                  </div>
                  <CheckMark $visible={roomIds.includes(r.id)} />
                </RoomCard>
              ))}
            </RoomGrid>

            {inHouse && selectedRoom && selectedRoom.minimum_cents != null && (
              <MinExplain>
                {selectedRooms.length > 1
                  ? `The ${selectedRoom.name} — and each extra room — carries a ${fmtCents(selectedRoom.minimum_cents)}/hour minimum on an ${hour >= 16 ? "evening" : "afternoon"}. A manager confirms the combined minimums. That's spend on food and drink, `
                  : `The ${selectedRoom.name} has a ${fmtCents(selectedRoom.minimum_cents)}/hour minimum on an ${hour >= 16 ? "evening" : "afternoon"}. That's what your party spends on food and drink — `}
                <strong>not a fee on top.</strong> Most parties of this
                size clear it without trying.
              </MinExplain>
            )}

            {inHouse && (
              <>
                <TableclothPicker>
                  <h4>Tablecloths</h4>
                  <p>Dress the tables for your party — $4 each, or leave them bare wood.</p>
                  <ClothChoices value={tablecloth} onChange={setTablecloth} />
                </TableclothPicker>
                <DrinksPicker
                  barMode={barMode}
                  onBarMode={setBarMode}
                  barBudgetCents={barBudgetCents}
                  onBarBudget={setBarBudgetCents}
                  barPackage={barPackage}
                  onBarPackage={setBarPackage}
                  sodaPitchers={sodaPitchers}
                  onPitcherQty={setPitcherQty}
                  pitcherCount={pitcherCount}
                  pitcherCents={pitcherCents}
                />
              </>
            )}
          </Step>

          {/* Step 3 — menu */}
          <Step $active={step === 2}>
            <StepHeader>
              <StepNum>3</StepNum>
              <div>
                <h2>Build a wish list</h2>
                <p>This is just a wish list — the kitchen doesn&apos;t cook from it.</p>
              </div>
            </StepHeader>

            {overMaxGuests ? (
              <Notice $tone="warn">
                For parties over {config.max_guests_web} guests we&apos;ll plan the menu together
                over the phone — call{" "}
                <a href="tel:+15088966135">{config.phone || PHONE}</a>.
              </Notice>
            ) : (
              <MenuList>
                {(config.menu || []).map((group) => {
                  const visible = group.items.filter(
                    (item) => !HIDDEN_MENU_ITEMS.has(itemSlug(item.name))
                  );
                  const groupItems = group.category === "drinks" ? orderDrinks(visible) : visible;
                  return (
                    <MenuGroup key={group.category}>
                      <h3>{group.category}</h3>
                      {groupItems.map((item) => (
                        <MenuItem key={item.id}>
                          <div className="item-img">
                            <img src={itemImage(item)} alt={item.name} onError={(e) => (e.target.src = FALLBACK_IMG)} />
                          </div>
                          <div className="item-info">
                            <div className="item-top">
                              <span className="item-name">
                                {item.name}
                                {item.size_label ? <span className="item-size"> — {item.size_label}</span> : null}
                              </span>
                              <span className="item-price">
                                {item.is_market_price
                                  ? item.price_note || "Market price"
                                  : item.price_cents === 0
                                  ? "No charge"
                                  : fmtCents(item.price_cents)}
                              </span>
                            </div>
                            <p className="item-desc">
                              {item.description}
                              <span className="item-covers">
                                {" "}
                                · {item.unit_label} · serves ~{item.covers}
                              </span>
                            </p>
                            {item.is_market_price && (
                              <p className="item-market">
                                {item.price_note
                                  ? `${item.price_note} — added to the wish list, not the total.`
                                  : "Market price — added to the wish list, not the total."}
                              </p>
                            )}
                            <Stepper>
                              <StepBtn onClick={() => setQty(item.id, -1)} aria-label={`Remove ${item.name}`}>
                                −
                              </StepBtn>
                              <Qty>{items[item.id] || 0}</Qty>
                              <StepBtn onClick={() => setQty(item.id, 1)} aria-label={`Add ${item.name}`}>
                                +
                              </StepBtn>
                            </Stepper>
                          </div>
                        </MenuItem>
                      ))}
                    </MenuGroup>
                  );
                })}
              </MenuList>
            )}
          </Step>

          {/* Step 4 — contact & send (also the desktop right rail) */}
          <Step $active={step === 3}>
            <StepHeader>
              <StepNum>4</StepNum>
              <div>
                <h2>Contact &amp; send</h2>
                <p>This is where you tell us the real story.</p>
              </div>
            </StepHeader>
            <ContactForm onSubmit={handleSubmit}>
              <Field>
                <label htmlFor="c-name">Your name</label>
                <input id="c-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Jane Laurino" />
              </Field>
              <Field>
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" />
              </Field>
              <Field>
                <label htmlFor="c-phone">Phone (optional)</label>
                <input
                  id="c-phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="(508) 555-0123"
                  aria-invalid={phoneInput && !phoneValid ? "true" : undefined}
                />
                {phoneInput && !phoneValid ? (
                  <p className="hint">
                    That doesn&apos;t look like a US number — use 10 digits, e.g. (508) 555-0123.
                  </p>
                ) : (
                  <p className="hint">A mobile number gets you a text when we pick up your request.</p>
                )}
              </Field>
              <Field>
                <label htmlFor="c-details">Anything we should know?</label>
                <textarea
                  id="c-details"
                  rows={4}
                  value={contact.details}
                  onChange={(e) => setContact({ ...contact, details: e.target.value })}
                  placeholder="My mother's 80th, she uses a walker, can we have the room near the door?"
                />
                <p className="hint">This matters more than the menu picks.</p>
              </Field>

              {/* Honeypot — hidden from humans, must stay empty */}
              <Honeypot>
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={contact.website}
                  onChange={(e) => setContact({ ...contact, website: e.target.value })}
                />
              </Honeypot>

              {overMaxGuests && (
                <Notice $tone="warn">
                  For parties over {config.max_guests_web} guests, give us a call at{" "}
                  <a href="tel:+15088966135">{config.phone || PHONE}</a> — we&apos;ll plan it with
                  you instead of a form.
                </Notice>
              )}

              <SendButton type="submit" disabled={!contactValid || overMaxGuests || submitting}>
                {overMaxGuests ? "Please call instead" : submitting ? "Sending…" : "Send request"}
              </SendButton>
              {submitError && <SubmitError>{submitError}</SubmitError>}
            </ContactForm>
          </Step>
        </Main>

        <Aside>
          <Rail>
          <Summary>
            <h3>Your request</h3>
            <SummaryLine>
              <span>Date</span>
              <strong>{prettyDate(date) || "—"}</strong>
            </SummaryLine>
            <SummaryLine>
              <span>Time</span>
              <strong>
                {prettyHour(hour)} – {prettyHour((hour + duration) % 24)}
              </strong>
            </SummaryLine>
            <SummaryLine>
              <span>Guests</span>
              <strong>{guestsInt || "—"}</strong>
            </SummaryLine>
            <SummaryLine>
              <span>Room</span>
              <strong>{roomLabel}</strong>
            </SummaryLine>

            <Divider />

            {inHouse && minimumCents != null && (
              <SummaryLine>
                <span>Room minimum</span>
                <strong>{fmtCents(minimumCents)} / hr</strong>
              </SummaryLine>
            )}
            <SummaryLine>
              <span>Menu wish list</span>
              <strong>{itemSubtotalCents > 0 ? fmtCents(itemSubtotalCents) : "$0"}</strong>
            </SummaryLine>
            {q?.discount_amount_cents > 0 && (
              <SummaryLine $muted>
                <span>Party discount</span>
                <strong>−{fmtCents(q.discount_amount_cents)}</strong>
              </SummaryLine>
            )}

            {inHouse && (
              <SummaryLine>
                <span>Tablecloths</span>
                <strong>
                  {selectedCloth.priceCents > 0
                    ? `${selectedCloth.name} +${fmtCents(selectedCloth.priceCents)}`
                    : "None (wood)"}
                </strong>
              </SummaryLine>
            )}

            {inHouse && (
              <SummaryLine>
                <span>Bar</span>
                <strong>{barSummary}</strong>
              </SummaryLine>
            )}

            {inHouse && pitcherCount > 0 && (
              <>
                <SummaryLine>
                  <span>Soda pitchers</span>
                  <strong>
                    {pitcherCount} × {fmtCents(PITCHER_CENTS)} · serves ~
                    {Math.round(pitcherCount * PITCHER_PEOPLE)}
                  </strong>
                </SummaryLine>
                <SummaryLine>
                  <span>Flavors</span>
                  <strong>
                    {pitcherLines
                      .filter((d) => d.qty > 0)
                      .map((d) => `${d.qty} ${d.name}`)
                      .join(", ")}
                  </strong>
                </SummaryLine>
              </>
            )}

            <Divider />

            <SummaryLine $big>
              <span>Estimated total</span>
              <strong>{fmtCents(displayedTotalCents)}</strong>
            </SummaryLine>

            {minimumCents != null && inHouse && (
              <MinimumNote>
                {spendCents >= minimumCents ? (
                  <>
                    ✓ Your food &amp; drink spend clears the {fmtCents(minimumCents)}/hour minimum.
                  </>
                ) : (
                  <>
                    The room has a {fmtCents(minimumCents)}/hour minimum. Add a tray or two — it&apos;s
                    spend on food &amp; drink, not a fee.
                  </>
                )}
              </MinimumNote>
            )}

            {guestsInt > 0 && !overMaxGuests && (
              <CoversNote>
                {coversEstimate > 0 ? (
                  <>
                    <strong>About {coversEstimate} people&apos;s worth.</strong>{" "}
                    {coversEstimate < guestsInt
                      ? `You said ${guestsInt}, so you may want another tray or two.`
                      : `That covers your ${guestsInt} guest${guestsInt === 1 ? "" : "s"}.`}
                  </>
                ) : (
                  <>Add menu items to see whether it&apos;s enough for {guestsInt}.</>
                )}
              </CoversNote>
            )}
          </Summary>

          {mounted && !isMobile && (
            <ChaferPanel>
              <div className="cp-head">
                <h3>How it&apos;s served</h3>
                {trayItems.length > 0 && (
                  <span className="cp-count">
                    {trayItems.length} item{trayItems.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              <div className="cp-stage">
                <ChaferViewer
                  items={trayItems}
                  tablecloth={inHouse ? tablecloth : "none"}
                  pitchers={inHouse ? pitcherColors : []}
                />
              </div>
              <p className="cp-hint">
                {trayItems.length
                  ? "Drag to spin · scroll to zoom"
                  : "Add hot menu items and watch them fill the chafing dishes."}
              </p>
              {inHouse && (
                <div className="cp-cloth">
                  <h4>Tablecloths</h4>
                  <ClothChoices value={tablecloth} onChange={setTablecloth} />
                </div>
              )}
              {inHouse && (
                <div className="cp-drinks">
                  <h4>Soda pitchers</h4>
                  {pitcherCount > 0 ? (
                    <p className="cp-pitcher-list">
                      {pitcherLines
                        .filter((d) => d.qty > 0)
                        .map((d) => `${d.qty} ${d.name}`)
                        .join(", ")}
                      {" — "}
                      <strong>{fmtCents(pitcherCents)}</strong>
                    </p>
                  ) : (
                    <p className="cp-pitcher-list">
                      {fmtCents(PITCHER_CENTS)} each · serves 2–3 · add them in the room step.
                    </p>
                  )}
                </div>
              )}
            </ChaferPanel>
          )}
          </Rail>
        </Aside>
      </Layout>

      {mounted && isMobile && (
        <>
          {!chaferOpen && (
            <MobileChaferBtn type="button" onClick={() => setChaferOpen(true)}>
              <span aria-hidden="true">▣</span>
              See your chafers
              {trayItems.length > 0 ? ` (${trayItems.length})` : ""}
            </MobileChaferBtn>
          )}
          {chaferOpen && (
            <ChaferOverlay role="dialog" aria-modal="true" aria-label="How your party food is served">
              <div className="co-head">
                <h3>How it&apos;s served</h3>
                <button type="button" onClick={() => setChaferOpen(false)} aria-label="Close 3D preview">
                  ✕
                </button>
              </div>
              <div className="co-stage">
                <ChaferViewer
                  items={trayItems}
                  tablecloth={inHouse ? tablecloth : "none"}
                  pitchers={inHouse ? pitcherColors : []}
                />
              </div>
              <p className="co-hint">
                {trayItems.length
                  ? "Drag to spin · pinch to zoom"
                  : "Add hot menu items and watch them fill the chafing dishes."}
              </p>
            </ChaferOverlay>
          )}
        </>
      )}

      <Disclaimer>
        <p>
          Menu photos are representative images sourced from the web, not photographs of
          our actual dishes. We&apos;re photographing our real menu now — until then these
          are approximate representations and your dish may look a little different.
        </p>
      </Disclaimer>

      {/* Mobile bottom nav */}
      <MobileBar>
        <div className="mb-total">
          {step >= 2 && <span className="mb-label">Est. total</span>}
          <span className="mb-amount">{step >= 2 ? fmtCents(displayedTotalCents) : `${guestsInt || "—"} guests`}</span>
        </div>
        <div className="mb-actions">
          {step > 0 && (
            <GhostButton onClick={() => setStep(step - 1)}>Back</GhostButton>
          )}
          {step < 3 ? (
            <PrimaryButton disabled={!canNext(step)} onClick={() => setStep(step + 1)}>
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton disabled={!contactValid || submitting} onClick={() => document.getElementById("contact-send")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              Review
            </PrimaryButton>
          )}
        </div>
      </MobileBar>
    </Page>
  );
}

/* ------------------------------------------------------------- constants */

const STEPS = ["Details", "Room", "Menu", "Send"];

/* ------------------------------------------------------------ subcomponents */

function Confirmation({ reference, date, hour, guests, roomName, phone }) {
  return (
    <Page>
      <Hero $slim>
        <h1>We&apos;ve got it.</h1>
      </Hero>
      <ConfirmationCard>
        <Badge>Request received</Badge>
        <h2>Reference {reference}</h2>
        <p>
          Your request for <strong>{prettyDate(date)}</strong> at <strong>{prettyHour(hour)}</strong>
          {roomName
            ? roomName.startsWith("No room")
              ? ` — ${roomName}`
              : ` in the ${roomName}`
            : ""}
          {guests ? `, ${guests} guest${guests === 1 ? "" : "s"}` : ""}.
        </p>
        <div className="blunt">
          <strong>This isn&apos;t booked yet.</strong> One of us will call you within a day to go
          through the details and confirm.
        </div>
        <p className="phone-line">
          Questions? <a href="tel:+15088966135">{phone || PHONE}</a>
        </p>
      </ConfirmationCard>
    </Page>
  );
}

/* ----------------------------------------------------------------- styles */

const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Hero = styled.section`
  position: relative;
  background-image: linear-gradient(rgba(24, 30, 34, 0.55), rgba(24, 30, 34, 0.55)), url("/parties/hero.jpg");
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: ${({ $slim }) => ($slim ? "4rem 2rem" : "6rem 2rem")};
  text-align: center;

  .hero-inner {
    max-width: 680px;
    margin: 0 auto;
  }

  h1 {
    font-family: "Aloja", serif;
    font-size: 3rem;
    font-weight: 400;
    margin: 0 0 1rem;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 1.15rem;
    line-height: 1.6;
    margin: 0 0 1.5rem;
    color: rgba(255, 255, 255, 0.92);
  }

  .hero-phone {
    display: inline-block;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 999px;
    padding: 0.6rem 1.4rem;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      background: #fff;
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ $slim }) => ($slim ? "3rem 1.25rem" : "3.5rem 1.25rem")};

    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Spinner = styled.span`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.accent};
  border-top-color: ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ClosedPanel = styled.div`
  max-width: 620px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;

  h2 {
    font-family: "Aloja", serif;
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  a {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    font-weight: 600;
  }
`;

const RetryButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem 1.6rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StepperNav = styled.nav`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 1rem 1rem 0;
    max-width: 640px;
    margin: 0 auto;
  }
`;

const StepDot = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $active, theme }) => ($active ? theme.colors.tertiaryDark : theme.colors.border)};
    transition: background 0.2s ease;
  }

  .label {
    font-size: 0.72rem;
    color: ${({ $active, theme }) => ($active ? theme.colors.tertiaryDark : theme.colors.mutedText)};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem 6rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem 8rem;
    max-width: 640px;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Step = styled.section`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.light};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $active }) => ($active ? "block" : "none")};
  }
`;

const StepHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  h2 {
    font-family: "Aloja", serif;
    font-size: 1.6rem;
    margin: 0 0 0.25rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 0.95rem;
  }
`;

const StepNum = styled.span`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  input,
  select,
  textarea {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    padding: 0.75rem 0.9rem;
    font-size: 1rem;
    font-family: inherit;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    width: 100%;
    min-height: 44px;

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
      outline-offset: 1px;
    }
  }

  textarea {
    resize: vertical;
  }

  .hint {
    margin: 0;
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.mutedText};
  }
`;

const Select = styled.select``;

const Notice = styled.div`
  background: ${({ $tone, theme }) =>
    $tone === "warn" ? "#FBF3E4" : theme.colors.accent};
  border-left: 4px solid ${({ $tone, theme }) => ($tone === "warn" ? "#D4A574" : theme.colors.tertiaryDark)};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.9rem 1.1rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    font-weight: 600;
  }
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.div`
  position: relative;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.colors.tertiaryDark : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  cursor: pointer;
  background: ${({ $selected, theme }) => ($selected ? "#EEF3F5" : theme.colors.cardBackground)};
  box-shadow: ${({ $selected, theme }) => ($selected ? theme.shadows.medium : "none")};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }

  .room-img {
    height: 150px;
    background: ${({ theme }) => theme.colors.accent};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .room-img--none {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.tertiaryDark};

    svg {
      width: 54px;
      height: 54px;
    }
  }

  .room-body {
    padding: 1rem;

    h3 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    p {
      margin: 0 0 0.5rem;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.mutedText};
    }

    .room-min {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.tertiaryDark};

      strong {
        font-size: 1.05rem;
      }
    }
  }
`;

const CheckMark = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ $visible, theme }) => ($visible ? theme.colors.tertiaryDark : "rgba(255,255,255,0.85)")};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  &::after {
    content: "✓";
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  }
`;

const MinExplain = styled.div`
  margin-top: 1.25rem;
  padding: 1rem 1.1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};
`;

const ClothOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  .tc-opt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 0.5rem;
    background: ${({ theme }) => theme.colors.background};
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

    &:hover {
      transform: translateY(-2px);
    }

    &[data-active="true"] {
      border-color: ${({ theme }) => theme.colors.tertiaryDark};
      box-shadow: ${({ theme }) => theme.shadows.light};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
      outline-offset: 2px;
    }
  }

  .tc-swatch {
    display: block;
    width: 100%;
    height: 34px;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .tc-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.15;

    strong {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.text};
      text-align: center;
    }

    em {
      font-size: 0.75rem;
      font-style: normal;
      color: ${({ theme }) => theme.colors.mutedText};
    }
  }
`;

const TableclothPicker = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};

  h4 {
    font-family: "Aloja", serif;
    font-size: 1.15rem;
    margin: 0 0 0.25rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  p {
    margin: 0 0 0.85rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.mutedText};
  }
`;

const DrinksPanel = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};

  h4 {
    font-family: "Aloja", serif;
    font-size: 1.15rem;
    margin: 0 0 0.25rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  .dp-intro {
    margin: 0 0 0.85rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.mutedText};
  }

  .bar-note {
    margin: 0.85rem 0 0;
    padding: 0.7rem 0.85rem;
    background: ${({ theme }) => theme.colors.background};
    border-left: 3px solid ${({ theme }) => theme.colors.tertiaryDark};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OpenBar = styled.div`
  margin: 0.5rem 0 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  .ob-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;

    span {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    strong {
      font-size: 1.15rem;
      color: ${({ theme }) => theme.colors.tertiaryDark};
    }
  }

  .ob-scale {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.mutedText};
    margin-bottom: 0.85rem;
  }
`;

const SliderWrap = styled.div`
  position: relative;
  margin: 1.1rem 0 0.35rem;
  padding: 0 2px;
`;

const BarRange = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  height: 8px;
  margin: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.tertiaryDark});
  outline: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tertiaryDark};
    outline-offset: 6px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: grab;
  }

  &::-moz-range-thumb {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: grab;
  }
`;

const MartiniThumb = styled.span`
  position: absolute;
  top: 50%;
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  pointer-events: none;
  transition: left 120ms ease-out;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.22));

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const PitcherBox = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};

  .pb-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.75rem;

    span {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    strong {
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.tertiaryDark};
      white-space: nowrap;
    }
  }

  .pb-flavors {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem 1.25rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      grid-template-columns: 1fr;
    }
  }

  .pb-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.15rem 0;

    .pb-name {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.text};

      i {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }
    }
  }

  .pb-serves,
  .pb-note {
    margin: 0.75rem 0 0;
    font-size: 0.82rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.colors.text};
  }

  .pb-note {
    padding: 0.7rem 0.85rem;
    background: ${({ theme }) => theme.colors.background};
    border-left: 3px solid ${({ theme }) => theme.colors.highlight};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  .pb-plain {
    margin: 0.85rem 0 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.mutedText};

    strong {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MenuGroup = styled.div`
  h3 {
    font-family: "Aloja", serif;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin: 0 0 0.75rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const MenuItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  .item-img {
    flex-shrink: 0;
    width: 84px;
    height: 84px;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item-top {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;

    .item-name {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};

      .item-size {
        font-weight: 400;
        color: ${({ theme }) => theme.colors.mutedText};
      }
    }

    .item-price {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.primaryDark};
      white-space: nowrap;
    }
  }

  .item-desc {
    margin: 0.25rem 0 0.5rem;
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.mutedText};

    .item-covers {
      color: ${({ theme }) => theme.colors.tertiaryDark};
      font-weight: 600;
    }
  }

  .item-market {
    margin: 0 0 0.5rem;
    font-size: 0.82rem;
    font-style: italic;
    color: ${({ theme }) => theme.colors.highlight};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .item-img {
      width: 64px;
      height: 64px;
    }
  }
`;

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  align-self: flex-start;
`;

const StepBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.tertiaryDark};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.tertiaryDark};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Qty = styled.span`
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  font-size: 1.05rem;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0.9rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 50px;
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitError = styled.div`
  color: #b3402f;
  background: #fbe9e6;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
`;

const Aside = styled.aside`
  /* stretch so the sticky rail can travel the full height of the menu column */
  align-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Rail = styled.div`
  position: sticky;
  top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
`;

const Summary = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};

  h3 {
    font-family: "Aloja", serif;
    font-size: 1.3rem;
    margin: 0 0 1rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;

  span {
    color: ${({ theme }) => theme.colors.mutedText};
  }

  strong {
    color: ${({ theme, $muted }) => ($muted ? theme.colors.highlight : theme.colors.text)};
    text-align: right;
  }

  ${({ $big }) =>
    $big &&
    `
    font-size: 1.15rem;
    padding: 0.5rem 0;
    strong { color: ${({ theme }) => theme.colors.tertiaryDark}; }
  `}
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0.75rem 0;
`;

const MinimumNote = styled.div`
  margin-top: 0.75rem;
  padding: 0.8rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const CoversNote = styled.div`
  margin-top: 0.75rem;
  padding: 0.8rem 0.9rem;
  background: #eef3f5;
  border-left: 3px solid ${({ theme }) => theme.colors.tertiaryDark};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const MobileBar = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
    background: ${({ theme }) => theme.colors.cardBackground};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
    z-index: 50;

    .mb-total {
      display: flex;
      flex-direction: column;

      .mb-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: ${({ theme }) => theme.colors.mutedText};
      }

      .mb-amount {
        font-size: 1.15rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.tertiaryDark};
      }
    }

    .mb-actions {
      display: flex;
      gap: 0.75rem;
    }
  }
`;

const Disclaimer = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 2rem;

  p {
    margin: 0;
    padding-top: 1.25rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.8rem;
    line-height: 1.55;
    text-align: center;
    color: ${({ theme }) => theme.colors.mutedText};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 1rem 6rem;
    margin-bottom: 0;
  }
`;

const ViewerSkeleton = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.mutedText};

  &::after {
    content: "Loading 3D preview…";
  }
`;

const ChaferPanel = styled.div`
  margin-top: 0;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};

  .cp-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.85rem;

    h3 {
      font-family: "Aloja", serif;
      font-size: 1.2rem;
      margin: 0;
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    .cp-count {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${({ theme }) => theme.colors.tertiaryDark};
      white-space: nowrap;
    }
  }

  .cp-stage {
    width: 100%;
    aspect-ratio: 1.8 / 1;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow: hidden;
    background: radial-gradient(circle at 50% 30%, #ffffff 0%, #f1f3f4 60%, #e3e6e8 100%);
    touch-action: none;

    canvas {
      display: block;
      touch-action: none;
    }

    .chafer-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      text-align: center;
      font-size: 0.82rem;
      color: ${({ theme }) => theme.colors.mutedText};
    }
  }

  .cp-hint {
    margin: 0.75rem 0 0;
    font-size: 0.78rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.mutedText};
  }

  .cp-cloth,
  .cp-drinks {
    margin-top: 1rem;
    padding-top: 0.9rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.border};

    h4 {
      font-family: "Aloja", serif;
      font-size: 1rem;
      margin: 0 0 0.6rem;
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  .cp-pitcher-list {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};

    strong {
      color: ${({ theme }) => theme.colors.tertiaryDark};
    }
  }
`;

const MobileChaferBtn = styled.button`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: fixed;
    right: 1rem;
    bottom: calc(84px + env(safe-area-inset-bottom));
    z-index: 60;
    background: ${({ theme }) => theme.colors.primaryDark};
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.65rem 1.1rem;
    font-size: 0.88rem;
    font-weight: 700;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
`;

const ChaferOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(0.85rem + env(safe-area-inset-top)) 0.85rem
    calc(0.85rem + env(safe-area-inset-bottom));
  background: rgba(20, 26, 30, 0.96);
  color: #fff;

  .co-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    h3 {
      font-family: "Aloja", serif;
      font-size: 1.2rem;
      font-weight: 400;
      margin: 0;
    }

    button {
      flex-shrink: 0;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
    }
  }

  .co-stage {
    width: 100%;
    aspect-ratio: 1.8 / 1;
    max-height: 58vh;
    margin: 0.6rem 0;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    overflow: hidden;
    background: radial-gradient(circle at 50% 32%, #2c363c 0%, #171d21 78%);
    touch-action: none;

    canvas {
      display: block;
      touch-action: none;
    }

    .chafer-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .co-hint {
    margin: 0;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.72);
  }
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0.7rem 1.6rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 48px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0.7rem 1.3rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
`;

const ConfirmationCard = styled.div`
  max-width: 620px;
  margin: 2rem auto 5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  h2 {
    font-family: "Aloja", serif;
    font-size: 1.7rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin: 0.75rem 0 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  .blunt {
    margin: 1.5rem 0;
    padding: 1.1rem;
    background: #FBF3E4;
    border: 1px solid #EAD7B8;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.55;
  }

  .phone-line a {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    font-weight: 700;
  }
`;

const Badge = styled.span`
  display: inline-block;
  background: #e7f0ea;
  color: #2f6b47;
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
`;

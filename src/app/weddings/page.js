"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = "https://laurinostavern.com";

// FAQs are the source of truth for both the visible accordion and the FAQPage
// structured data below, so the two can never drift apart.
const FAQS = [
  {
    q: "Do you host wedding receptions on Cape Cod?",
    a: "Yes. Laurino's Tavern hosts wedding receptions in our private rooms at 3668 Main Street in Brewster, MA. We handle the food, the bar and the room setup, so you can keep the celebration in one place instead of coordinating several vendors.",
  },
  {
    q: "Can we have a rehearsal dinner here in Brewster?",
    a: "Absolutely. Rehearsal dinners are one of the events we book most. Tell us your date and headcount and we'll match you to a private room, build a menu of seafood, Italian favorites and comfort food, and take care of the bar.",
  },
  {
    q: "How many guests can you accommodate?",
    a: "We host everything from intimate 10-person dinners to much larger celebrations. Rooms are available separately or together. Send us your guest count through the party request form and a manager will confirm the best space for your group.",
  },
  {
    q: "Do you provide catering and bar service for events?",
    a: "Yes. Our on-site catering covers hot chafing trays, salads, pizza, entrees and sides, and we offer a hosted open bar or a cash bar, plus non-alcoholic pitchers by the table. For off-site or drop-off needs, see our catering page.",
  },
  {
    q: "Can you host a bridal shower, engagement party or birthday?",
    a: "We do. Bridal showers, engagement parties, welcome parties, anniversaries, birthdays, corporate dinners and other private events all run well in our rooms. If it deserves a private space and good food, we can host it.",
  },
  {
    q: "How far in advance should we book?",
    a: "Cape Cod wedding season fills fast, so reach out as early as you can — especially for Saturday dates from late spring through the fall. Short notice? Give us a call at (508) 896-6135 and we'll see what we can do.",
  },
];

// FAQ + breadcrumb structured data. This is what makes the questions eligible
// for FAQ rich results and tells Google where /weddings sits in the site.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/weddings#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/weddings#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Weddings & Events",
          item: `${SITE_URL}/weddings`,
        },
      ],
    },
  ],
};

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
`;

const Hero = styled.section`
  position: relative;
  min-height: 62vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  color: #fff;
  padding: 5rem 1.5rem;

  .bg {
    position: absolute;
    inset: 0;
    object-fit: cover;
    z-index: 0;
  }
  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(20, 26, 31, 0.55) 0%,
      rgba(20, 26, 31, 0.72) 100%
    );
    z-index: 1;
  }
  .inner {
    position: relative;
    z-index: 2;
    max-width: 860px;
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 0.78rem;
    font-weight: 600;
    opacity: 0.9;
    margin-bottom: 1rem;
  }
  h1 {
    font-family: "Aloja", "Aloja Fallback", serif;
    font-size: clamp(2rem, 5vw, 3.4rem);
    line-height: 1.1;
    margin-bottom: 1.1rem;
  }
  p {
    font-size: clamp(1rem, 2.2vw, 1.25rem);
    line-height: 1.65;
    max-width: 660px;
    margin: 0 auto 1.9rem;
    opacity: 0.96;
  }
  .cta-row {
    display: flex;
    gap: 0.9rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0.85rem 1.7rem;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.tertiaryDark};
    border: 2px solid ${({ theme }) => theme.colors.primaryLight};
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
    &.ghost {
      background: transparent;
      color: #fff;
      border-color: rgba(255, 255, 255, 0.7);
      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }
  }
`;

const Section = styled.section`
  max-width: 1120px;
  margin: 0 auto;
  padding: 4rem 1.5rem;

  h2 {
    font-family: "Aloja", "Aloja Fallback", serif;
    color: ${({ theme }) => theme.colors.tertiaryDark};
    font-size: clamp(1.6rem, 3.5vw, 2.3rem);
    margin-bottom: 1rem;
    text-align: center;
  }
  .lede {
    max-width: 760px;
    margin: 0 auto 2.6rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 1.05rem;
    line-height: 1.7;
  }
  .prose {
    max-width: 780px;
    margin: 0 auto;
    color: ${({ theme }) => theme.colors.primaryDark};
    font-size: 1.05rem;
    line-height: 1.8;
  }
  .prose p + p {
    margin-top: 1.1rem;
  }
  a.inline {
    color: ${({ theme }) => theme.colors.tertiaryDark};
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-top: 0.5rem;

  .card {
    background: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    padding: 1.6rem 1.4rem;
    box-shadow: ${({ theme }) => theme.shadows.light};

    h3 {
      font-family: "Aloja", "Aloja Fallback", serif;
      color: ${({ theme }) => theme.colors.tertiaryDark};
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: ${({ theme }) => theme.colors.mutedText};
      line-height: 1.6;
      font-size: 0.98rem;
    }
  }
`;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2.5rem;
  align-items: center;
  margin-top: 1rem;

  .copy h2 {
    text-align: left;
  }
  .copy p {
    color: ${({ theme }) => theme.colors.primaryDark};
    line-height: 1.8;
    font-size: 1.03rem;
  }
  .copy p + p {
    margin-top: 1rem;
  }
  .media {
    position: relative;
    min-height: 320px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.medium};
    img {
      object-fit: cover;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    .copy h2 {
      text-align: center;
    }
    .media {
      min-height: 240px;
    }
  }
`;

const Steps = styled.ol`
  list-style: none;
  counter-reset: step;
  max-width: 820px;
  margin: 0.5rem auto 0;
  padding: 0;
  display: grid;
  gap: 1rem;

  li {
    counter-increment: step;
    background: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    padding: 1.2rem 1.4rem 1.2rem 4rem;
    position: relative;
    color: ${({ theme }) => theme.colors.primaryDark};
    line-height: 1.6;
    box-shadow: ${({ theme }) => theme.shadows.light};

    &::before {
      content: counter(step);
      position: absolute;
      left: 1.1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.tertiaryDark};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    strong {
      color: ${({ theme }) => theme.colors.tertiaryDark};
    }
  }
`;

const Faq = styled.div`
  max-width: 820px;
  margin: 0 auto;
  display: grid;
  gap: 0.75rem;

  details {
    background: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    padding: 0.35rem 1.2rem;
    box-shadow: ${({ theme }) => theme.shadows.light};
  }
  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.tertiaryDark};
    padding: 0.9rem 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    &::-webkit-details-marker {
      display: none;
    }
    &::after {
      content: "+";
      font-size: 1.4rem;
      line-height: 1;
      color: ${({ theme }) => theme.colors.primaryDark};
      transition: transform 0.2s ease;
    }
  }
  details[open] summary::after {
    content: "–";
  }
  details p {
    color: ${({ theme }) => theme.colors.mutedText};
    line-height: 1.75;
    padding-bottom: 1.1rem;
    margin: 0;
  }
`;

const CtaBand = styled.section`
  background: ${({ theme }) => theme.colors.tertiaryDark};
  color: #fff;
  text-align: center;
  padding: 4rem 1.5rem;

  h2 {
    font-family: "Aloja", "Aloja Fallback", serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    margin-bottom: 1rem;
  }
  p {
    max-width: 620px;
    margin: 0 auto 1.9rem;
    line-height: 1.7;
    opacity: 0.95;
  }
  .cta-row {
    display: flex;
    gap: 0.9rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0.85rem 1.7rem;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    background: #fff;
    color: ${({ theme }) => theme.colors.tertiaryDark};
    border: 2px solid #fff;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
    &.ghost {
      background: transparent;
      color: #fff;
      border-color: rgba(255, 255, 255, 0.7);
      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }
  }
`;

const CELEBRATIONS = [
  {
    title: "Wedding receptions",
    body: "Private rooms and on-site catering for the reception, from cocktail hour through dinner and dancing.",
  },
  {
    title: "Rehearsal dinners",
    body: "A relaxed dinner the night before the wedding — seafood, Italian classics and comfort food, with room for toasts.",
  },
  {
    title: "Bridal showers & engagement parties",
    body: "A private space, a menu guests actually remember, and bar service handled by us.",
  },
  {
    title: "Welcome & farewell parties",
    body: "Gather the out-of-town guests at the start or end of the wedding weekend.",
  },
  {
    title: "Birthday & anniversary parties",
    body: "Milestone dinners and celebrations with a room of your own and a custom menu.",
  },
  {
    title: "Corporate & team dinners",
    body: "Off-site dinners, client evenings and group meals in Brewster, minutes from Route 6.",
  },
];

export default function WeddingsPage() {
  return (
    <Page>
      <script
        type="application/ld+json"
        // Static, trusted object — safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero>
        <Image
          className="bg"
          src="/weddingpic.jpg"
          alt="Cape Cod wedding reception at Laurino's Tavern in Brewster, MA"
          fill
          priority
          sizes="100vw"
        />
        <div className="scrim" />
        <div className="inner">
          <p className="eyebrow">Weddings &amp; private events · Brewster, MA</p>
          <h1>Cape Cod Weddings, Receptions &amp; Rehearsal Dinners</h1>
          <p>
            Laurino&apos;s Tavern is a family-run Cape Cod restaurant and event venue
            in Brewster, MA. We host wedding receptions, rehearsal dinners, bridal
            showers and private parties — with the food, bar and room all handled in
            one place.
          </p>
          <div className="cta-row">
            <Link href="/parties" className="cta">
              Start your event request
            </Link>
            <a href="tel:+15088966135" className="cta ghost">
              Call (508) 896-6135
            </a>
          </div>
        </div>
      </Hero>

      <Section>
        <h2>A Cape Cod wedding venue that already knows how to feed a crowd</h2>
        <div className="prose">
          <p>
            Planning a wedding on Cape Cod means juggling a venue, a caterer and a bar.
            At Laurino&apos;s, those are the same address. Our private rooms in Brewster
            sit minutes from Orleans, Chatham, Harwich and the rest of the Lower Cape,
            and our kitchen turns out the fresh local seafood, hand-tossed pizza and
            Italian classics Cape Cod is known for — cooked for your guest count, not
            plated one at a time.
          </p>
          <p>
            Whether you are booking a full wedding reception, a rehearsal dinner the
            night before, or a private party for a bridal shower, engagement, birthday
            or anniversary, the process is the same: send us your date and headcount,
            tell us what sounds good, and a manager calls you back to confirm the
            details and the price. There is no payment up front.
          </p>
          <p>
            See room availability and build a menu on the{" "}
            <Link href="/parties" className="inline">
              party &amp; event request page
            </Link>
            , browse the{" "}
            <Link href="/components/menu" className="inline">
              full menu
            </Link>
            , or read about{" "}
            <Link href="/components/catering" className="inline">
              on-site and drop-off catering
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section>
        <h2>Celebrations we host</h2>
        <p className="lede">
          If it deserves a private room and a real meal, we can host it in Brewster.
        </p>
        <Grid>
          {CELEBRATIONS.map((c) => (
            <div className="card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </Grid>
      </Section>

      <Section>
        <Feature>
          <div className="copy">
            <h2>Private rooms for the whole wedding weekend</h2>
            <p>
              Our event spaces include a private dining room, an atrium, a patio and an
              outdoor bar — so a single location can carry a rehearsal dinner, a
              welcome party and the reception itself. Rooms book on their own or
              together for larger groups.
            </p>
            <p>
              Tell us your guest count and we&apos;ll match you to the right space. Set
              the tables with black, white or navy tablecloths, or keep the bare wood.
              Pick your room on the{" "}
              <Link href="/parties" className="inline">
                party request page
              </Link>
              .
            </p>
          </div>
          <div className="media">
            <Image
              src="/parties/room-private.jpg"
              alt="Private event room set for a wedding reception at Laurino's Tavern in Brewster, Massachusetts"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
            />
          </div>
        </Feature>
      </Section>

      <Section>
        <Feature>
          <div className="media">
            <Image
              src="/LobsterRoll.jpg"
              alt="Fresh Cape Cod seafood catering for a wedding reception at Laurino's Tavern"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
            />
          </div>
          <div className="copy">
            <h2>Catering &amp; bar, handled in-house</h2>
            <p>
              Catering covers hot chafing trays, salads, pizza, grilled and fried
              favorites, entrees and sides — plus dessert. For drinks, choose a hosted
              open bar that you cap at a budget you set, a cash bar where guests pay
              their own, or soda pitchers for the tables.
            </p>
            <p>
              Everything is cooked and served by our team, so you are not chasing
              vendors on the day. Learn more on the{" "}
              <Link href="/components/catering" className="inline">
                catering page
              </Link>
              .
            </p>
          </div>
        </Feature>
      </Section>

      <Section>
        <h2>Planning your event is simple</h2>
        <p className="lede">
          No deposits, no payment up front. You talk to a person before anything is
          final.
        </p>
        <Steps>
          <li>
            <strong>Send a request.</strong> Share your date, start and end time,
            guest count and the room or rooms you like on the{" "}
            <Link href="/parties" className="inline">
              event request page
            </Link>
            .
          </li>
          <li>
            <strong>Build a wish list.</strong> Add menu items and drinks to get an
            estimate — it is a wish list, not a final order.
          </li>
          <li>
            <strong>A manager calls you back.</strong> We confirm the room, the menu,
            the bar and the price together, then lock in your date.
          </li>
        </Steps>
      </Section>

      <Section>
        <h2>Wedding &amp; party questions, answered</h2>
        <Faq>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Faq>
      </Section>

      <CtaBand>
        <h2>Let&apos;s plan your Cape Cod celebration</h2>
        <p>
          From wedding receptions to rehearsal dinners and private parties in Brewster,
          MA — send a request or call and we&apos;ll take it from there.
        </p>
        <div className="cta-row">
          <Link href="/parties" className="cta">
            Start your event request
          </Link>
          <a href="tel:+15088966135" className="cta ghost">
            Call (508) 896-6135
          </a>
        </div>
      </CtaBand>
    </Page>
  );
}

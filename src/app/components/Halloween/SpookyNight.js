"use client";

import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

/**
 * SpookyNight
 * A short, purely atmospheric intro for the hero: a moonlit sky fades in on
 * load, plays for a few seconds, then fades away and unmounts so the normal
 * daytime hero returns.
 *
 * Decorative only — pointer-events are disabled so every hero control stays
 * usable. Skipped entirely for `prefers-reduced-motion`. The module-scoped
 * guard means it plays on a real load/reload but not when navigating back to
 * the homepage from another page.
 */

let hasPlayedThisLoad = false;

const FADE_MS = 800; // fade in/out duration
const HOLD_MS = 2600; // how long the night stays fully on

const fogDrift = keyframes`
  0%   { transform: translateX(-6%); }
  100% { transform: translateX(6%); }
`;

const batFlap = keyframes`
  0%, 100% { transform: scaleY(1); }
  50%      { transform: scaleY(0.42); }
`;

const batFly = keyframes`
  0%   { transform: translate(-14vw, 10px); opacity: 0; }
  12%  { opacity: 0.9; }
  88%  { opacity: 0.9; }
  100% { transform: translate(96vw, -34px); opacity: 0; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.32; }
  50%      { opacity: 1; }
`;

const Stage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  opacity: ${({ $shown }) => ($shown ? 1 : 0)};
  transition: opacity ${FADE_MS}ms ease;

  /* Night wash over the daytime photo. */
  .night {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        ellipse 70% 55% at 74% 16%,
        rgba(38, 44, 78, 0.55),
        transparent 60%
      ),
      radial-gradient(
        ellipse 120% 90% at 50% 40%,
        rgba(9, 10, 22, 0.55),
        rgba(4, 5, 12, 0.94) 78%
      );
  }

  .ground {
    position: absolute;
    left: -5%;
    right: -5%;
    bottom: -2%;
    height: 24%;
    background: linear-gradient(
      to top,
      rgba(3, 4, 9, 0.98) 30%,
      rgba(6, 7, 14, 0.72) 62%,
      transparent 100%
    );
    border-radius: 50% 50% 0 0 / 26% 26% 0 0;
  }

  .moon {
    position: absolute;
    top: 9%;
    right: 14%;
    width: clamp(56px, 7vw, 96px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 34%, #fffdf2, #ecdfbe 62%, #cdbb92);
    box-shadow:
      0 0 32px 10px rgba(255, 246, 220, 0.35),
      0 0 90px 40px rgba(255, 236, 190, 0.16);
  }
  .moon::before,
  .moon::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(196, 180, 140, 0.5);
  }
  .moon::before {
    width: 22%;
    height: 22%;
    top: 26%;
    left: 24%;
  }
  .moon::after {
    width: 15%;
    height: 15%;
    top: 58%;
    left: 58%;
  }

  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.7);
    animation: ${twinkle} 3s ease-in-out infinite;
  }

  .fog {
    position: absolute;
    left: -20%;
    right: -20%;
    bottom: 6%;
    height: 34%;
  }
  .fog i {
    position: absolute;
    display: block;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(214, 224, 240, 0.16),
      rgba(214, 224, 240, 0) 70%
    );
    filter: blur(10px);
    animation: ${fogDrift} 6s ease-in-out infinite alternate;
  }
  .fog i:nth-child(1) { width: 46%; height: 100%; left: 2%;  top: 6%;  animation-duration: 7s; }
  .fog i:nth-child(2) { width: 38%; height: 84%;  left: 34%; top: 18%; animation-duration: 5.5s; }
  .fog i:nth-child(3) { width: 44%; height: 92%;  left: 62%; top: 2%;  animation-duration: 8s; }

  .bat {
    position: absolute;
    top: 14%;
    left: 0;
    width: clamp(26px, 3vw, 42px);
    color: #05060b;
    opacity: 0;
    animation: ${batFly} 5.4s linear infinite;
  }
  .bat svg { display: block; width: 100%; height: auto; }
  .bat .wing {
    transform-box: fill-box;
    transform-origin: 50% 30%;
    animation: ${batFlap} 0.42s ease-in-out infinite;
  }
  .bat.b2 { top: 8%;  width: clamp(18px, 2vw, 28px); animation-duration: 6.2s; animation-delay: 0.7s; }
  .bat.b3 { top: 22%; width: clamp(14px, 1.6vw, 22px); animation-duration: 7.1s; animation-delay: 1.5s; }
`;

function BatSvg() {
  return (
    <svg viewBox="0 0 60 34" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <g className="wing">
          <path d="M28 16 C 20 6 10 4 2 10 C 9 11 14 15 17 20 C 13 19 8 20 4 24 C 12 24 20 22 28 18 Z" />
        </g>
        <g className="wing">
          <path d="M32 16 C 40 6 50 4 58 10 C 51 11 46 15 43 20 C 47 19 52 20 56 24 C 48 24 40 22 32 18 Z" />
        </g>
        <ellipse cx="30" cy="14" rx="5" ry="7" />
        <path d="M26 8 L27 2 L30 7 Z" />
        <path d="M34 8 L33 2 L30 7 Z" />
      </g>
    </svg>
  );
}

export default function SpookyNight() {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || hasPlayedThisLoad) return;
    hasPlayedThisLoad = true;

    setMounted(true);

    // Fade in on the next frame so the opacity transition runs.
    const raf = requestAnimationFrame(() => setShown(true));

    timers.current.push(setTimeout(() => setShown(false), FADE_MS + HOLD_MS));
    timers.current.push(
      setTimeout(() => setMounted(false), FADE_MS + HOLD_MS + FADE_MS + 80)
    );

    return () => {
      cancelAnimationFrame(raf);
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
  }, []);

  if (!mounted) return null;

  return (
    <Stage $shown={shown} aria-hidden="true">
      <div className="night" />
      <div className="ground" />

      <div className="moon" />
      <span className="star" style={{ top: "14%", left: "18%" }} />
      <span className="star" style={{ top: "26%", left: "32%", animationDelay: "0.6s" }} />
      <span className="star" style={{ top: "10%", left: "48%", animationDelay: "1.4s" }} />
      <span className="star" style={{ top: "30%", left: "62%", animationDelay: "0.9s" }} />
      <span className="star" style={{ top: "18%", left: "84%", animationDelay: "2s" }} />
      <span className="star" style={{ top: "38%", left: "8%", animationDelay: "1.1s" }} />

      <div className="bat b1"><BatSvg /></div>
      <div className="bat b2"><BatSvg /></div>
      <div className="bat b3"><BatSvg /></div>

      <div className="fog">
        <i />
        <i />
        <i />
      </div>
    </Stage>
  );
}

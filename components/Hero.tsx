"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Easing } from "motion/react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import MenuOverlay from "@/components/MenuOverlay";

// All copy lives here so it can be edited without touching the layout.
export const NAV = [
  { label: "Home", href: "#" },
  { label: "The Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];

const SCENE_1 = {
  headline: ["WHAT LIES", "BEYOND"],
  num: "01",
  title: "THE DECISION",
  body: "Every better life begins with a single choice. We help you make yours, and see it through.",
  cta: { label: "Begin", href: "#path" },
  next: { num: "02", title: "THE PATH" },
  stat: { label: ["STEP", "ONE OF THREE"], value: "01", suffix: "/3" },
};

const SCENE_2 = { headline: ["STEP", "THROUGH"] };

const SCENE_3 = {
  headline: ["YOUR LIFE,", "BY DECISION"],
  num: "03",
  title: "THE SUMMIT",
  body: "Clarity, a plan and people who walk it with you. The view is earned one decision at a time.",
  aside: "Not everyone is ready to open the door. If you are, someone is already waiting on the other side.",
  cta: { label: "Open the door", href: "#contact" },
};

// ---------------------------------------------------------------------------
// Timeline: one 13 s loop, keyframes taken from the Figma "Hero 1440" animation.

const DURATION = 13;
const DESIGN_W = 1440;
const DESIGN_H = 810;

const lin: Easing = "linear";
const out: Easing = "easeOut";
const EXPO: Easing = [0.1, 1, 0.22, 1];
const SNAP_IN: Easing = [0.85, 0, 0.95, 0.25];
const EXIT_LEFT: Easing = [0.55, 0, 0.85, 0.3];

// values, times (0–1 of the loop), easing per segment
type Track = [values: number[], times: number[], ease: Easing[]];
type Timeline = Record<string, Track>;

// With reduced motion the page freezes at this point of the loop: scene 1, fully shown.
const STILL_AT = 0.3;

function valueAt([values, times]: Track, t: number) {
  let i = 0;
  while (i + 1 < times.length && times[i + 1] <= t) i++;
  return values[i];
}

// Fade + rise into place at `start`; scene 1 items also fade out at `exit`.
function rise(
  start: number,
  dy: number,
  { fade, move, exit, peak = 1 }: { fade: number; move: number; exit?: [number, number]; peak?: number },
): Timeline {
  const opacity: Track = exit
    ? [[0, 0, peak, peak, 0, 0], [0, start, start + fade, exit[0], exit[1], 1], [lin, out, lin, out, lin]]
    : [[0, 0, peak, peak], [0, start, start + fade, 1], [lin, out, lin]];
  return { opacity, y: [[dy, dy, 0, 0], [0, start, start + move, 1], [lin, EXPO, lin]] };
}

const S1 = { fade: 0.023, move: 0.0446, exit: [0.5962, 0.6192] as [number, number] };
const S3 = { fade: 0.0215, move: 0.04 };
const CHROME = { fade: 0.02, move: 0.0369 };

const T = {
  background: {
    scale: [
      [1, 1.05, 1.42, 1, 1.02],
      [0, 0.2462, 0.5654, 0.6769, 1],
      ["easeInOut", [0.62, 0, 0.9, 0.3], [0.1, 0.9, 0.25, 1], "easeInOut"],
    ],
  },
  bgRoom: { opacity: [[1, 1, 0, 0], [0, 0.555, 0.6, 1], [lin, out, lin]] },
  bgSummit: { opacity: [[0, 0, 1, 1], [0, 0.735, 0.75, 1], [lin, out, lin]] },

  scrim: { opacity: [[0, 1, 1], [0, 0.0269, 1], [out, lin]] },
  mark: rise(0.0154, -12, CHROME),
  nav: rise(0.02, -10, CHROME),
  grid: rise(0.0246, -10, CHROME),
  search: rise(0.0277, -10, CHROME),

  scene1: { opacity: [[1, 1, 0, 0], [0, 0.6231, 0.6269, 1], [lin, out, lin]] },
  s1Headline1: {
    ...rise(0.0385, 40, { fade: 0.023, move: 0.0446 }),
    x: [[0, 0, -1400, -1400], [0, 0.5038, 0.5577, 1], [lin, EXIT_LEFT, lin]],
  },
  s1Headline2: {
    ...rise(0.0462, 40, { fade: 0.023, move: 0.0446 }),
    x: [[0, 0, -1400, -1400], [0, 0.5038, 0.5577, 1], [lin, EXIT_LEFT, lin]],
  },
  s1Num: rise(0.0662, 18, S1),
  s1Title: rise(0.0692, 18, S1),
  s1Body: rise(0.0738, 18, S1),
  s1Cta: rise(0.0815, 18, S1),
  s1Rule: { opacity: rise(0.0892, 0, S1).opacity },
  s1NextNum: rise(0.0923, 12, S1),
  s1NextTitle: rise(0.0954, 12, S1),
  s1Stat: rise(0.1031, 26, S1),

  scene2: {
    opacity: [[0, 0, 1, 1, 0, 0], [0, 0.6038, 0.6077, 0.7331, 0.7392, 1], [lin, out, lin, out, lin]],
  },
  s2Headline1: {
    opacity: [[0, 0, 1, 1, 0, 0], [0, 0.6077, 0.6277, 0.7115, 0.7308, 1], [lin, out, lin, out, lin]],
    scale: [[1, 1, 6.5, 6.5], [0, 0.6885, 0.7331, 1], [lin, SNAP_IN, lin]],
    y: [[34, 34, 0, 0, -520, -520], [0, 0.6077, 0.6462, 0.6885, 0.7331, 1], [lin, EXPO, lin, SNAP_IN, lin]],
  },
  s2Headline2: {
    opacity: [[0, 0, 1, 1, 0, 0], [0, 0.6146, 0.6346, 0.7115, 0.7308, 1], [lin, out, lin, out, lin]],
    scale: [[1, 1, 6.5, 6.5], [0, 0.6885, 0.7331, 1], [lin, SNAP_IN, lin]],
    y: [[34, 34, 0, 0, 380, 380], [0, 0.6146, 0.6531, 0.6885, 0.7331, 1], [lin, EXPO, lin, SNAP_IN, lin]],
  },

  scene3: { opacity: [[0, 0, 1, 1], [0, 0.7385, 0.7423, 1], [lin, out, lin]] },
  s3Headline1: rise(0.7423, 34, S3),
  s3Headline2: rise(0.7492, 34, S3),
  s3Aside: rise(0.7577, 14, { ...S3, peak: 0.6 }),
  s3Card: rise(0.7638, 26, S3),
  s3Num: rise(0.7685, 14, S3),
  s3Title: rise(0.7723, 14, S3),
  s3Pager: { opacity: rise(0.7731, 0, S3).opacity },
  s3Body: rise(0.7762, 14, { ...S3, peak: 0.55 }),
  s3Cta: rise(0.78, 14, S3),
} satisfies Record<string, Timeline>;

function useTimeline() {
  const reduce = useReducedMotion();
  return (timeline: Timeline) => {
    const entries = Object.entries(timeline);
    if (reduce) {
      const still = Object.fromEntries(entries.map(([k, tr]) => [k, valueAt(tr, STILL_AT)]));
      return { initial: still, animate: still };
    }
    return {
      initial: Object.fromEntries(entries.map(([k, [values]]) => [k, values[0]])),
      animate: Object.fromEntries(entries.map(([k, [values]]) => [k, values])),
      transition: Object.fromEntries(
        entries.map(([k, [, times, ease]]) => [k, { duration: DURATION, times, ease, repeat: Infinity }]),
      ),
    };
  };
}

// Desktop: the 1440×810 design is scaled to fit the window. Mobile (<768px) uses its own layout.
function useDesignScale() {
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setScale(desktop.matches ? Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H) : null);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

// ---------------------------------------------------------------------------

const numClass = "font-display text-[18px] md:text-[17px] leading-[1.2] text-white/55";
const titleClass = "font-bold text-[13px] md:text-[12px] leading-[1.2] tracking-[0.6px] text-white/95";
// Brighter on phones: the photos sit behind the text there, so the design's faint grey is unreadable.
const bodyClass = "text-[13px] md:text-[10.5px] leading-[1.68] text-white md:text-white/55";
const ctaClass =
  "flex h-[40px] md:h-[34px] items-center rounded-[5px] bg-accent px-[24px] text-[12px] md:text-[11px] text-accent-ink transition-[filter] hover:brightness-110";

export default function Hero() {
  const tl = useTimeline();
  const scale = useDesignScale();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const stageStyle: CSSProperties | undefined = scale
    ? { transform: `translate(-50%, -50%) scale(${scale})` }
    : undefined;
  const chromeStyle: CSSProperties | undefined = scale
    ? { width: `${100 / scale}%`, transform: `scale(${scale})` }
    : undefined;

  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-background text-white">
      {/* Backgrounds (stills from the Figma video plates) */}
      <motion.div className="absolute inset-0" {...tl(T.background)}>
        <Image src="/hero/bg-flight.png" alt="" fill sizes="100vw" className="object-cover" />
        <motion.div className="absolute inset-0" {...tl(T.bgRoom)}>
          <Image src="/hero/bg-room.png" alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0" {...tl(T.bgSummit)}>
          <Image src="/hero/bg-summit.png" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.div>

      {/* Mood: dimmed photos, dark edges, and a fade into the page below */}
      <div className="pointer-events-none absolute inset-0 bg-[rgba(8,6,5,0.28)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,5,4,0.8)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] bg-linear-to-b from-transparent to-background" />

      {/* Stage: 1440×810 design space on desktop */}
      <div
        className="absolute inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:h-[810px] md:w-[1440px] md:[transform:translate(-50%,-50%)]"
        style={stageStyle}
      >
        {/* Scene 1 */}
        <motion.div className="absolute inset-0" {...tl(T.scene1)}>
          <h1
            aria-label={SCENE_1.headline.join(" ")}
            className="absolute left-5 top-[20svh] inline-grid font-display text-[11.5vw] leading-[0.92] md:left-[64px] md:top-[119px] md:text-[132px]"
          >
            <motion.span aria-hidden className="whitespace-nowrap" {...tl(T.s1Headline1)}>
              {SCENE_1.headline[0]}
            </motion.span>
            <motion.span aria-hidden className="-mt-[0.1em] flex justify-between" {...tl(T.s1Headline2)}>
              {SCENE_1.headline[1].split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </motion.span>
          </h1>

          <motion.p className={`absolute left-5 top-[52svh] md:left-[64px] md:top-[424px] ${numClass}`} {...tl(T.s1Num)}>
            {SCENE_1.num}
          </motion.p>
          <motion.h2
            className={`absolute left-[56px] top-[calc(52svh+3px)] md:left-[100px] md:top-[427px] ${titleClass}`}
            {...tl(T.s1Title)}
          >
            {SCENE_1.title}
          </motion.h2>
          <motion.p
            className={`absolute left-[56px] top-[calc(52svh+32px)] w-[65vw] md:left-[100px] md:top-[456px] md:w-[220px] ${bodyClass}`}
            {...tl(T.s1Body)}
          >
            {SCENE_1.body}
          </motion.p>
          <motion.a
            href={SCENE_1.cta.href}
            className={`absolute left-[56px] top-[calc(52svh+120px)] md:left-[100px] md:top-[522px] ${ctaClass}`}
            {...tl(T.s1Cta)}
          >
            {SCENE_1.cta.label}
          </motion.a>

          <motion.div
            className="absolute bottom-[72px] left-5 right-5 h-px bg-white/16 md:bottom-auto md:right-auto md:left-[64px] md:top-[636px] md:w-[1312px]"
            {...tl(T.s1Rule)}
          />
          <motion.p
            className="absolute bottom-[42px] left-5 font-display text-[15px] leading-[1.2] text-white/40 md:bottom-auto md:left-[64px] md:top-[652px]"
            {...tl(T.s1NextNum)}
          >
            {SCENE_1.next.num}
          </motion.p>
          <motion.p
            className="absolute bottom-[44px] left-[56px] text-[11px] leading-[1.2] tracking-[0.55px] text-white/55 md:bottom-auto md:left-[100px] md:top-[655px]"
            {...tl(T.s1NextTitle)}
          >
            {SCENE_1.next.title}
          </motion.p>

          <motion.a
            href="#path"
            className="absolute left-[1076px] top-[578px] hidden h-[108px] w-[300px] overflow-hidden rounded-[10px] bg-[rgba(10,9,8,0.52)] md:block"
            {...tl(T.s1Stat)}
          >
            <span className="absolute left-[20px] top-[20px] text-[9px] leading-[1.5] tracking-[0.72px] text-white/72">
              {SCENE_1.stat.label[0]}
              <br />
              {SCENE_1.stat.label[1]}
            </span>
            <span className="absolute left-[200px] top-[16px] flex items-start">
              <span className="font-display text-[30px] tracking-[-0.3px] text-white">{SCENE_1.stat.value}</span>
              <span className="mt-[10px] text-[11px] text-white/80">{SCENE_1.stat.suffix}</span>
            </span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute top-[68px] h-[22px] w-[30px] overflow-hidden rounded-[4px]"
                style={{ left: 20 + i * 36 }}
              >
                <Image
                  src={`/hero/thumb-${i}.png`}
                  alt=""
                  width={30}
                  height={30}
                  className="absolute left-0 top-[-4px] size-[30px] max-w-none object-cover"
                />
              </span>
            ))}
            <Image
              src="/hero/card-arrow.svg"
              alt=""
              width={13.2}
              height={13.2}
              unoptimized
              className="absolute left-[265.4px] top-[73.4px]"
            />
          </motion.a>
        </motion.div>

        {/* Scene 2 */}
        <motion.div className="absolute inset-0" {...tl(T.scene2)}>
          <h2
            aria-label={SCENE_2.headline.join(" ")}
            className="absolute inset-x-0 top-[30svh] text-center font-display text-[15vw] leading-[0.9] tracking-[0.01em] md:top-[169px] md:text-[104px]"
          >
            <motion.span aria-hidden className="block" {...tl(T.s2Headline1)}>
              {SCENE_2.headline[0]}
            </motion.span>
            <motion.span aria-hidden className="-mt-[0.02em] block" {...tl(T.s2Headline2)}>
              {SCENE_2.headline[1]}
            </motion.span>
          </h2>
        </motion.div>

        {/* Scene 3 */}
        <motion.div className="absolute inset-0" {...tl(T.scene3)}>
          <h2
            aria-label={SCENE_3.headline.join(" ")}
            className="absolute left-5 top-[20svh] font-display text-[10vw] leading-[0.9] tracking-[0.01em] md:left-[64px] md:top-[129px] md:text-[96px]"
          >
            <motion.span aria-hidden className="block whitespace-nowrap" {...tl(T.s3Headline1)}>
              {SCENE_3.headline[0]}
            </motion.span>
            <motion.span aria-hidden className="-mt-[0.025em] block whitespace-nowrap" {...tl(T.s3Headline2)}>
              {SCENE_3.headline[1]}
            </motion.span>
          </h2>

          <motion.p
            className="absolute left-[1116px] top-[132px] hidden w-[260px] text-[10.5px] leading-[1.68] text-white/60 md:block"
            {...tl(T.s3Aside)}
          >
            {SCENE_3.aside}
          </motion.p>
          <motion.div
            className="absolute left-[1000px] top-[310px] hidden h-[190px] w-[250px] overflow-hidden rounded-[10px] md:block"
            {...tl(T.s3Card)}
          >
            <Image src="/hero/s3-card.png" alt="" fill sizes="250px" className="object-cover" />
          </motion.div>
          <motion.div className="absolute left-[1000px] top-[512px] hidden md:block" {...tl(T.s3Pager)}>
            <Image src="/hero/pager.svg" alt="" width={50} height={6} unoptimized />
          </motion.div>

          <motion.p className={`absolute left-5 top-[52svh] md:left-[64px] md:top-[424px] ${numClass}`} {...tl(T.s3Num)}>
            {SCENE_3.num}
          </motion.p>
          <motion.h3
            className={`absolute left-[56px] top-[calc(52svh+3px)] md:left-[100px] md:top-[427px] ${titleClass}`}
            {...tl(T.s3Title)}
          >
            {SCENE_3.title}
          </motion.h3>
          <motion.p
            className={`absolute left-[56px] top-[calc(52svh+32px)] w-[65vw] md:left-[100px] md:top-[456px] md:w-[220px] ${bodyClass}`}
            {...tl(T.s3Body)}
          >
            {SCENE_3.body}
          </motion.p>
          <motion.a
            href={SCENE_3.cta.href}
            className={`absolute left-[56px] top-[calc(52svh+120px)] md:left-[100px] md:top-[522px] ${ctaClass}`}
            {...tl(T.s3Cta)}
          >
            {SCENE_3.cta.label}
          </motion.a>
        </motion.div>
      </div>

      {/* Header, scaled with the design on desktop but always full width */}
      <MenuOverlay open={menuOpen} onClose={closeMenu} items={NAV} />

      <header
        className={`absolute left-0 top-0 h-[100px] w-full origin-top-left ${menuOpen ? "z-[45]" : "z-10"}`}
        style={chromeStyle}
      >
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-[220px] bg-linear-to-b from-[rgba(5,5,6,0.62)] via-[rgba(5,5,6,0.24)] via-45% to-[rgba(5,5,6,0)]"
          {...tl(T.scrim)}
        />
        <motion.a
          href="#"
          aria-label="Swiss Media Center, home"
          className="absolute left-5 top-[34px] flex size-[22px] items-center justify-center md:left-[40px]"
          {...tl(T.mark)}
        >
          <Image src="/hero/mark.svg" alt="" width={20.9232} height={22} unoptimized priority />
        </motion.a>

        <motion.nav
          aria-label="Main"
          className="absolute left-1/2 top-[32px] hidden -translate-x-1/2 gap-[4px] md:flex"
          {...tl(T.nav)}
        >
          {NAV.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={i === 0 ? "page" : undefined}
              className={`flex h-[30px] items-center rounded-[8px] px-[13px] text-[10px] tracking-[0.2px] transition-colors ${
                i === 0 ? "bg-white/14 text-white/95" : "text-white/60 hover:bg-white/8 hover:text-white/95"
              }`}
            >
              {item.label}
            </a>
          ))}
          <motion.a href="#contact" aria-label="Contact" className="ml-[10px] flex items-center" {...tl(T.search)}>
            <Image src="/hero/search.svg" alt="" width={11} height={11} unoptimized />
          </motion.a>
        </motion.nav>

        <motion.button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((o) => !o)}
          className={`absolute right-5 top-[28px] size-[38px] rounded-[10px] transition-transform md:right-[40px] ${menuOpen ? "rotate-45" : ""}`}
          {...tl(T.grid)}
        >
          <Image src="/hero/grid.svg" alt="" width={38} height={38} unoptimized />
        </motion.button>
      </header>
    </section>
  );
}

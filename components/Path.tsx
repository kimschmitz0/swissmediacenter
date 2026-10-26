import Reveal from "@/components/Reveal";

const STEPS = [
  {
    num: "01",
    title: "DECIDE",
    body: "Name the life you want. Out loud, without excuses. Everything else follows from this moment.",
  },
  {
    num: "02",
    title: "PREPARE",
    body: "Together we map the road: what to learn, who to meet, and the first ten steps that make it real.",
  },
  {
    num: "03",
    title: "BECOME",
    body: "You walk it. We stay beside you until the life you imagined is simply the life you live.",
  },
];

export default function Path() {
  return (
    <section id="path" className="relative px-5 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-[1312px]">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] text-white/45">THE PATH</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-[14ch] font-display text-[13vw] leading-[0.92] md:text-[96px]">
            Three decisions. One different life.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-14 border-t border-white/10 pt-14 md:mt-28 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={0.15 * i}>
              <p className="font-display text-[40px] leading-none text-white/35">{step.num}</p>
              <h3 className="mt-6 text-[13px] font-bold tracking-[0.25em] text-white/95">{step.title}</h3>
              <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.7] text-white/55">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="relative px-5 pb-20 pt-28 md:px-16 md:pt-40">
      <div className="mx-auto grid max-w-[1312px] gap-16 md:grid-cols-[1fr_1.2fr] md:gap-24">
        <div>
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] text-white/45">CONTACT</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-[13vw] leading-[0.92] md:text-[96px]">
              The door
              <br />
              is open.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[36ch] text-[15px] leading-[1.7] text-white/55">
              Tell us where you want to be. Every message is read personally, and the first step
              starts with a conversation.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>

      <footer className="mx-auto mt-32 flex max-w-[1312px] flex-wrap justify-between gap-4 border-t border-white/10 pt-8 text-[12px] text-white/35">
        <span>© Swiss Media Center</span>
        <span>Switzerland</span>
      </footer>
    </section>
  );
}

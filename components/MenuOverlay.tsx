"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

// Full-screen menu opened from the dotted button in the header.
export default function MenuOverlay({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: { label: string; href: string }[];
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-[rgba(10,8,7,0.94)] px-5 pb-12 pt-28 backdrop-blur-md md:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
        >
          <nav aria-label="Menu" className="flex flex-col gap-2">
            {items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-5 py-2 font-display text-[14vw] leading-none text-white/90 transition-colors hover:text-accent md:text-[88px]"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08 * i + 0.1, ease: [0.1, 1, 0.22, 1] }}
              >
                <span className="text-[15px] text-white/35">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </motion.a>
            ))}
          </nav>
          <p className="mt-auto text-[12px] tracking-[0.3em] text-white/35">SWISS MEDIA CENTER</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

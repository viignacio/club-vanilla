"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaqSectionBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";

interface FaqSectionProps {
  block: FaqSectionBlock;
  lang: Lang;
}

export default function FaqSection({ block, lang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const heading = getLocalized(block.sectionHeading, lang);
  const subheading = getLocalized(block.sectionSubheading, lang);
  const alignment = block.headingAlignment ?? "center";
  const alignClass =
    alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center";

  return (
    <section className="bg-dark-900 pt-16 sm:pt-24">
      <div className="block-container">
        <div className="sm:rounded-2xl sm:border sm:border-brand-purple/20 sm:p-12">
        {/* Section header */}
        <div className={`${alignClass} mb-12`}>
          {heading && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                {heading}
              </span>
            </h2>
          )}
          {subheading && (
            <p className="text-white/60 text-lg">{subheading}</p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {block.items?.map((item, index) => {
            const question = getLocalized(item.question, lang);
            const answer = getLocalized(item.answer, lang);
            const isOpen = openIndex === index;

            return (
              <div
                key={item._key}
                className={`rounded-xl border transition-colors duration-300 ${
                  isOpen
                    ? "border-brand-pink/50 bg-dark-800"
                    : "border-brand-purple/20 bg-dark-800/50"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-base sm:text-lg transition-colors ${
                      isOpen ? "text-brand-pink" : "text-white"
                    }`}
                  >
                    {question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-brand-purple/40 text-brand-purple-light"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-white/70 text-base leading-relaxed whitespace-pre-line border-t border-brand-purple/10 pt-4">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}

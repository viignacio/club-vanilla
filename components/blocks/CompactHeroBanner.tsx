"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { CompactHeroBannerBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface CompactHeroBannerProps {
  block: CompactHeroBannerBlock;
  lang: Lang;
}

const textVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0, transition: { duration: 0.8, ease: "easeIn" } },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40, transition: { duration: 0.8, ease: "easeIn" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayed}<span className="animate-pulse">|</span></>;
}

export default function CompactHeroBanner({ block, lang }: CompactHeroBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heading = getLocalized(block.heading, lang);
  const subheading = getLocalized(block.subheading, lang);
  const ctaLabel = getLocalized(block.ctaButton?.label, lang);
  const overlayOpacity = (block.overlayOpacity ?? 50) / 100;
  const animation = block.textAnimation ?? "fadeIn";
  const variants = textVariants[animation] ?? textVariants.fadeIn;
  const [textVisible, setTextVisible] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (animation === "none") return;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const cycle = () => {
      t1 = setTimeout(() => {
        setTextVisible(false);
        t2 = setTimeout(() => {
          setCycleKey((k) => k + 1);
          setTextVisible(true);
          cycle();
        }, 2000);
      }, 6000);
    };
    cycle();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animation]);
  const alignment = block.contentAlignment ?? "center";
  const sectionJustify =
    alignment === "left" ? "justify-start" : alignment === "right" ? "justify-end" : "justify-center";
  const contentClass =
    alignment === "left"
      ? "pl-16 max-w-2xl text-left items-start"
      : alignment === "right"
        ? "pr-16 max-w-2xl text-right items-end"
        : "px-4 max-w-3xl mx-auto text-center items-center";

  const bgImageUrl =
    block.backgroundType === "image" && block.backgroundImage
      ? urlFor(block.backgroundImage).width(1920).url()
      : null;
  const bgImageLqip = block.backgroundImage?.asset?.metadata?.lqip;

  const posterUrl =
    block.backgroundVideo?.posterImage
      ? urlFor(block.backgroundVideo.posterImage).width(1920).url()
      : null;

  const videoUrl = block.backgroundVideo?.videoFile?.asset?.url ?? null;

  return (
    <section className={`relative mt-16 sm:mt-20 h-[30vh] flex items-center ${sectionJustify} overflow-hidden`}>
      {/* Background */}
      {block.backgroundType === "video" && videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl ?? undefined}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : bgImageUrl ? (
        <Image
          src={bgImageUrl}
          alt={heading}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder={bgImageLqip ? "blur" : "empty"}
          blurDataURL={bgImageLqip}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-brand-navy to-dark-900" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark-900"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className={`relative z-10 flex flex-col ${contentClass}`}>
        <motion.div
          initial="hidden"
          animate={textVisible ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="flex flex-col"
        >
          {heading && (
            <motion.h2
              variants={variants}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            >
              {animation === "typewriter" ? (
                <span className="bg-gradient-to-r from-brand-pink via-brand-purple-light to-brand-purple bg-clip-text text-transparent">
                  <TypewriterText key={cycleKey} text={heading} />
                </span>
              ) : (
                <span className="bg-gradient-to-r from-brand-pink via-brand-purple-light to-brand-purple bg-clip-text text-transparent">
                  {heading}
                </span>
              )}
            </motion.h2>
          )}

          {subheading && (
            <motion.p
              variants={variants}
              className="text-sm sm:text-base text-white/80 mb-4 leading-relaxed max-w-xl"
            >
              {subheading}
            </motion.p>
          )}

          {ctaLabel && block.ctaButton?.href && (
            <motion.div variants={variants}>
              <Link
                href={block.ctaButton.href}
                className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-pink/30"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

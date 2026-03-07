"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { HeroBannerBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface HeroBannerProps {
  block: HeroBannerBlock;
  lang: Lang;
}

const textVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0, transition: { duration: 0.8, ease: "easeIn" } },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60, transition: { duration: 0.8, ease: "easeIn" } },
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

export default function HeroBanner({ block, lang }: HeroBannerProps) {
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
        : "px-4 max-w-4xl mx-auto text-center items-center";

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
    <section data-hero-banner className={`relative min-h-screen flex items-center ${sectionJustify} overflow-hidden`}>
      {/* Background */}
      {block.backgroundType === "video" && videoUrl ? (
        <>
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
        </>
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
        // Fallback gradient background
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-brand-navy to-dark-900" />
      )}

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              background: i % 2 === 0 ? "#FF69B4" : "#8B5CF6",
              width: `${200 + i * 60}px`,
              height: `${200 + i * 60}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

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
            <motion.h1
              variants={variants}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
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
            </motion.h1>
          )}

          {subheading && (
            <motion.p
              variants={variants}
              className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl"
            >
              {subheading}
            </motion.p>
          )}
        </motion.div>

        {ctaLabel && block.ctaButton?.href && (
          <Link
            href={block.ctaButton.href}
            className="inline-block mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-pink/30"
          >
            {ctaLabel}
          </Link>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}

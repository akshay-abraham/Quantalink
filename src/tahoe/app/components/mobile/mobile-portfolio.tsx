"use client";

import Image from "next/image";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import type { Profile } from "../../lib/content/schema";
import MobilePortfolioNav from "./mobile-portfolio-nav";

export default function MobilePortfolio({ profile }: { profile: Profile }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="phone-portfolio">
        <MobilePortfolioNav profile={profile} />
        <main className="phone-home-main">
          <section
            className="phone-home-hero"
            aria-labelledby="phone-home-title"
          >
            <motion.div
              className="phone-home-portrait relative"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src="/akshay-abraham-aiboomi-portrait.webp"
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 767px) 52vw, 210px"
                className="phone-home-image"
              />
            </motion.div>
            <motion.h1
              id="phone-home-title"
              className="phone-display-name"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.1,
                ease: "easeOut",
              }}
            >
              {profile.name}
            </motion.h1>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}

"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFullscreen } from "../../hooks/use-fullscreen";
import type { Profile } from "../../lib/content/schema";
import Symbol from "../symbol";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Journey" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function MobilePortfolioNav({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [fullscreenNotice, setFullscreenNotice] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const location = profile.summary
    .match(/\bbased in ([^—.]+)/i)?.[1]
    ?.replace(/,\s*$/, "")
    .trim();

  return (
    <MotionConfig reducedMotion="user">
      <div className="mobile-portfolio-nav">
        <header className="mobile-portfolio-header">
          <Link href="/" className="mobile-portfolio-brand">
            {profile.name}
          </Link>
          <div className="mobile-portfolio-header-actions">
            <button
              type="button"
              className="mobile-portfolio-fullscreen-button"
              aria-label={
                isFullscreen ? "Exit full screen" : "Enter full screen"
              }
              aria-pressed={isFullscreen}
              onClick={async (event) => {
                event.stopPropagation();
                setFullscreenNotice(!(await toggleFullscreen()));
              }}
            >
              <Symbol
                name={
                  isFullscreen
                    ? "arrow-down-right-and-arrow-up-left"
                    : "arrow-up-left-and-arrow-down-right"
                }
                className="w-4 h-4"
              />
            </button>
            <button
              type="button"
              className="mobile-portfolio-menu-button"
              aria-label={
                open ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={open}
              aria-controls={open ? "mobile-portfolio-menu" : undefined}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((value) => !value);
              }}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </header>

        {fullscreenNotice && (
          <div className="mobile-fullscreen-notice" role="status">
            <span>
              Full screen isn’t supported here. Add the site to your Home Screen
              for an app-like view.
            </span>
            <button
              type="button"
              onClick={() => setFullscreenNotice(false)}
              aria-label="Dismiss full screen message"
            >
              ×
            </button>
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-portfolio-menu"
              className="mobile-portfolio-menu"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, clipPath: "inset(0 0 0% 0)" }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
              }
              transition={{
                duration: reduceMotion ? 0.15 : 0.45,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="mobile-menu-body">
                <div className="mobile-menu-profile">
                  <p>{profile.role}</p>
                  {location && (
                    <p>
                      <span>Location:</span> {location}
                    </p>
                  )}
                  <p>
                    <span>Focus:</span> {profile.focus.slice(0, 3).join(", ")}
                  </p>
                </div>
                <nav aria-label="Main navigation">
                  {navigation.map(({ href, label }, index) => (
                    <motion.div
                      key={href}
                      initial={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0.15 : 0.35,
                        delay: reduceMotion ? 0 : 0.08 + index * 0.045,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={href}
                        aria-current={pathname === href ? "page" : undefined}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpen(false);
                        }}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{label}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

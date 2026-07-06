import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Player } from "@lottiefiles/react-lottie-player";

const NAV_ITEMS = [
  { label: "Assets", href: "#assets" },
  { label: "FAQ", href: "#faq" },
  { label: "About Us", href: "#about" },
];

/**
 * Sticky navbar: shrinks + frosts on scroll. Center links use the
 * "spotlight" lighting effect (mouse-following radial light + active-item
 * ambience line) adapted from the user's SpotlightNavbar.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#about") {
        setActiveIndex(2);
      } else if (hash === "#faq") {
        setActiveIndex(1);
      } else if (hash === "#assets") {
        setActiveIndex(0);
      } else {
        setActiveIndex(-1);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, idx: number) => {
    e.preventDefault();
    setActiveIndex(idx);
    setDrawerOpen(false);

    if (href === "#about") {
      window.location.hash = "#about";
    } else {
      if (window.location.hash === "#about") {
        window.location.hash = href;
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
      } else {
        window.location.hash = href;
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHovering(true);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHovering(false);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;
        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;
      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);



  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "nav-glass py-2" : "bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.hash === "#about") {
                window.location.hash = "";
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="group flex items-center gap-1"
          >
            <div className="h-10 w-10 flex items-center justify-center -ml-2">
              <Player
                autoplay
                loop
                src="/assets/Mascot.json"
                style={{ height: "42px", width: "42px" }}
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-deep dark:text-white">
              Morphysics
            </span>
          </a>

          {/* Center: spotlight links (desktop) */}
          <nav
            ref={navRef}
            className={cn(
              "relative hidden h-11 items-center overflow-hidden rounded-full lg:flex",
              "border border-slate-deep/10 bg-white/50 shadow-sm dark:border-white/10 dark:bg-white/5",
              "[--spotlight-color:rgba(35,39,61,0.08)] dark:[--spotlight-color:rgba(255,200,0,0.18)]",
              "[--ambience-color:rgba(35,39,61,0.9)] dark:[--ambience-color:#FFC800]",
            )}
          >
            <ul className="relative z-10 flex h-full items-center px-2">
              {NAV_ITEMS.map((item, idx) => (
                <li key={item.label} className="flex h-full items-center">
                  <a
                    href={item.href}
                    data-index={idx}
                    onClick={(e) => handleNavClick(e, item.href, idx)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                      activeIndex === idx
                        ? "text-slate-deep dark:text-white"
                        : "text-slate-gray hover:text-slate-deep dark:text-white/50 dark:hover:text-white",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mouse-follow spotlight */}
            <div
              className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
              style={{
                opacity: hovering ? 1 : 0,
                background:
                  "radial-gradient(120px circle at var(--spotlight-x, 50%) 100%, var(--spotlight-color) 0%, transparent 50%)",
              }}
            />
            {/* Active-item ambience line */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[2px] w-full transition-opacity duration-300"
              style={{
                opacity: activeIndex === -1 ? 0 : 1,
                background:
                  "radial-gradient(60px circle at var(--ambience-x, 50%) 0%, var(--ambience-color) 0%, transparent 100%)",
              }}
            />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-9 p-1" />
            <button
              className="hidden rounded-xl border border-slate-deep/20 px-5 py-2 text-sm font-semibold transition-colors hover:border-gold hover:text-gold-hover dark:border-white/20 dark:hover:border-gold dark:hover:text-gold sm:block"
              type="button"
            >
              Login
            </button>
            <button
              className="hidden rounded-xl bg-gold px-5 py-2 text-sm font-bold text-slate-deep shadow-lg shadow-gold/30 transition-all hover:bg-gold-hover hover:shadow-gold/50 active:scale-95 sm:block"
              type="button"
            >
              Sign Up
            </button>
            <button
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-slate-deep/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="surface fixed right-0 top-0 z-[70] flex h-full w-72 flex-col gap-2 p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  type="button"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, idx)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                    activeIndex === idx
                      ? "bg-gold/10 text-gold-hover"
                      : "hover:bg-gold/10 hover:text-gold-hover"
                  )}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-auto flex flex-col gap-3">
                <button
                  className="w-full rounded-xl border border-slate-deep/20 py-3 font-semibold dark:border-white/20"
                  type="button"
                >
                  Login
                </button>
                <button
                  className="w-full rounded-xl bg-gold py-3 font-bold text-slate-deep"
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

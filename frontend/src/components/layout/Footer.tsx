import { Player } from "@lottiefiles/react-lottie-player";
import { Atom, Facebook, Github, Youtube } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Physics Playground", "Pricing", "Assets", "Changelog"],
  },
  {
    title: "Company",
    links: ["About Us", "FAQ", "Contact", "Blog / Resources"],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-slate-deep">
                <Atom className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-xl font-bold">
                Morphysics
              </span>
            </div>
            <p className="mt-3 font-display italic text-white/70">
              "Make the Static Dynamic."
            </p>
            <div className="mt-4 h-20 w-20 opacity-90">
              <Player
                autoplay
                loop
                src="/assets/Mascot.json"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={
                        link === "Physics Playground"
                          ? "#playground"
                          : link === "Pricing"
                            ? "#pricing"
                            : link === "Contact"
                              ? "#contact"
                              : "#"
                      }
                      className="text-sm text-white/60 transition-colors hover:text-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal & Connect */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">
              Legal & Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 transition-colors hover:text-gold"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 transition-colors hover:text-gold"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[Facebook, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-gold hover:text-gold"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row">
          <span>© 2026 Morphysics. All rights reserved.</span>
          <span>Made with ❤️ in Ho Chi Minh City, Vietnam.</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);


  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsVisible(true);
      setMenuOpen(false);
    }
  };

 
  return (
    <header
      className="fixed left-1/2 top-7 z-50 w-[calc(100%_-_1.5rem)] max-w-[46rem] -translate-x-1/2 sm:w-[calc(100%_-_3rem)]"
    >
      <div
        className={`navbar-motion ${
          isVisible ? "navbar-motion-visible" : "navbar-motion-hidden"
        }`}
      >
        <div className="rounded-[1.65rem] border border-white/18 bg-white/[0.045] px-3 py-3 shadow-[0_18px_60px_rgba(8,7,18,0.22)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.045] sm:px-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#top");
              }}
              className="col-start-1 flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1 text-white transition hover:bg-white/8 sm:px-2"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-base font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:h-11 sm:w-11">
                CV
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-lg">
                  CV Optimizer
                </p>
              </div>
            </a>

            <nav className="col-start-2 hidden items-center justify-center gap-1.5 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="col-start-3 flex items-center justify-end gap-2">
              <a
                href="#signin"
                className="inline-flex h-9 min-w-18 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#17131f] shadow-[0_10px_35px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff]"
              >
                Sign in
              </a>

              <button
                type="button"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/8 text-white transition hover:bg-white/12 md:hidden"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              menuOpen ? "max-h-48 pt-3 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
        
          </div>
        </div>
      </div>
    </header>
  );
}

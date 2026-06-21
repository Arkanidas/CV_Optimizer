"use client";
import { useState } from "react";
import logo from '@/app/assets/logo1.png';

const navLinks = [
  { href: "#howitworks", label: "How it Works" },
  { href: "#faq", label: "FAQ" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed left-1/2 top-7 z-50 w-[calc(100%_-_1.5rem)] max-w-[55rem] -translate-x-1/2 sm:w-[calc(100%_-_3rem)]">
      <div className={`navbar-motion ${isVisible ? "navbar-motion-visible" : "navbar-motion-hidden"}`}>
        <div className="rounded-[1.65rem] border border-white/18 bg-white/[0.045] shadow-[0_18px_60px_rgba(8,7,18,0.22)] backdrop-blur-md backdrop-saturate-150 bg-white/[0.045]">
          <div className="flex items-center justify-between h-14 gap-4 px-3 py-2 sm:gap-6 sm:px-5">

            {/* LEFT — logo + wordmark */}
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); scrollToSection("#top"); }}
              className="flex flex-1 items-center gap-2 rounded-2xl px-1 py-1 text-white sm:px-2 relative left-2"
            >
              <img
                src={logo.src}
                alt="Logo"
                className="h-10 w-10 shrink-0 sm:h-12 sm:w-13"
              />
              <p className="truncate text-sm font-semibold sm:text-lg">CV Optimizer</p>
            </a>

            {/* CENTER — nav links (hidden on mobile) */}
            <nav className="hidden items-center justify-center gap-1.5 md:flex gap-3">
              {navLinks.map((link, index) => (
                <span key={link.href} className="flex items-center">
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-md font-medium text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                  {index < navLinks.length - 1 && (
                    <span className="text-white/15 select-none relative left-1.5"> |</span>
                  )}
                </span>
              ))}
            </nav>

            {/* RIGHT — sign in + mobile hamburger */}
            <div className="flex flex-1 items-center justify-end">
              <a
                href="#signin"
                className="inline-flex relative right-5 h-9 min-w-18 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-[#17131f] shadow-[0_10px_35px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff]"
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

          {/* Mobile dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              menuOpen ? "max-h-48 pt-3 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1 pb-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}     
                </a>
              ))}
            </nav>
          </div>

        </div>
      </div>
    </header>
  );
}

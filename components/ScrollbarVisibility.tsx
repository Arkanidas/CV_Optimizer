"use client";

import { useEffect } from "react";

export default function ScrollbarVisibility() {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function handleScroll() {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 800);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
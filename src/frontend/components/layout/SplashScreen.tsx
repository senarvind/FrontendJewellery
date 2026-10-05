"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Completely remove from DOM after 2.5 seconds
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#FFF8F0] flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 animate-spin-three-times">
        <Image
          src="/logo-old.png"
          alt="Keshar Jewellers Logo"
          fill
          priority
          className="object-contain drop-shadow-xl"
        />
      </div>
    </div>
  );
}

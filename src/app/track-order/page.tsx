"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrackOrderAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/orders");
  }, [router]);

  return (
    <div className="min-h-[70vh] bg-[#FFF8F0] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-[#7C1B2A] rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-serif text-[#7C1B2A]">Redirecting to Order Tracker...</p>
      </div>
    </div>
  );
}

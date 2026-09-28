"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { sanitizeUserError } from "@/lib/security/errorHandler";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  userMessage: string;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    userMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    const sanitized = sanitizeUserError(error);
    return {
      hasError: true,
      userMessage: sanitized.userMessage,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("Uncaught React Error:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-6 text-center bg-[#FFF8F0]">
          <div className="w-16 h-16 rounded-full bg-[#FFE2D8] border border-[#D4AF37]/50 flex items-center justify-center text-2xl mb-4 text-[#B82E44]">
            💎
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#7C1B2A] font-bold mb-2">
            Keshar Jewellers
          </h2>
          <p className="text-sm text-[#6F4A4A] max-w-md mb-6 leading-relaxed">
            {this.state.userMessage || "Something went wrong while loading this page. Please try refreshing."}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Refresh Page
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-[#FFFDFC] border border-[#E8CFC5] text-[#35191C] hover:bg-[#FFE2D8] rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Go to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

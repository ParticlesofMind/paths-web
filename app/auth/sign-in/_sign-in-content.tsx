"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  async function handleAppleSignIn() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    // Browser is redirected by Supabase; no cleanup needed.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-sm px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Paths</h1>
          <p className="mt-2 text-sm text-neutral-500">Sign in to continue</p>
        </div>

        {errorParam === "auth_callback_failed" && (
          <p className="mb-6 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-center">
            Sign in failed. Please try again.
          </p>
        )}

        {/*
          White button on dark background → black logo (per Apple HIG).
          Logo is a fixed 20px tall inside the 44px button — matching Apple's
          spec where the glyph occupies ~45% of the button height.
          Local SVG asset from /public, no external dependency.
        */}
        <button
          onClick={handleAppleSignIn}
          disabled={loading}
          aria-label="Sign in with Apple"
          className="w-full h-[44px] flex items-center justify-center gap-[6px] rounded-[10px] bg-white text-black hover:bg-[#f5f5f7] active:bg-[#e8e8ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
            fontSize: "17px",
            fontWeight: 500,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/apple-logo-black.svg" alt="" width={20} height={20} aria-hidden />
          <span>{loading ? "Redirecting…" : "Sign in with Apple"}</span>
        </button>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-rose-200/60 bg-white/40 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-6">
        {/* Logo & tagline */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💜</span>
            <span className="font-black text-xl gradient-text tracking-tight">Sangam</span>
          </div>
          <p className="text-xs text-gray-500 text-center max-w-xs">
            The world&apos;s first ZK-private dating dApp on Hela Network.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <Link href="/register" className="hover:text-rose-500 transition-colors">Register</Link>
          <Link href="/swipe" className="hover:text-rose-500 transition-colors">Swipe</Link>
          <Link href="/matches" className="hover:text-rose-500 transition-colors">Matches</Link>
        </div>

        {/* Chain badges */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-rose-500/10 border border-rose-300/50 text-rose-600 px-3 py-1 rounded-full font-semibold">
            ⛓️ Hela Network
          </span>
          <span className="text-[11px] bg-violet-500/10 border border-violet-300/50 text-violet-600 px-3 py-1 rounded-full font-semibold">
            🔐 ZK Proofs
          </span>
          <span className="text-[11px] bg-emerald-500/10 border border-emerald-300/50 text-emerald-600 px-3 py-1 rounded-full font-semibold">
            🛡️ Privacy First
          </span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-gray-400 text-center">
          <p>Built with 💜 for <span className="text-rose-500 font-semibold">HackJKLU v5.0</span> · Hela Labs Track</p>
          <p className="mt-0.5">© {new Date().getFullYear()} Sangam — Deployed on Hela Network (Chain ID: 666888)</p>
        </div>
      </div>
    </footer>
  );
}

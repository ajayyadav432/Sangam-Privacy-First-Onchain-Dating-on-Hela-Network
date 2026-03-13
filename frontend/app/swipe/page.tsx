    "use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import SwipeCard, { CardProfile } from "@/components/SwipeCard";

// ── Mock profiles for demo (replace with on-chain event indexing) ─────────────
const DEMO_PROFILES: CardProfile[] = [
  {
    address: "0x4A3B8fEa2D9C1F5e6D7b0A9c3E2F8B1d4C5A6B7C",
    name: "Aria Nova",
    age: 24,
    bio: "On-chain explorer 🌐 | DeFi degen by day, jazz pianist by night. Looking for someone to HODL with.",
    interests: ["🎵 Music", "✈️ Travel", "📚 Books", "🎮 Gaming"],
    photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    interests_ids: [1, 5, 4, 2],
  },
  {
    address: "0x9F2A1b3C4d5E6f7A8B9c0D1e2F3a4B5c6D7e8F9a",
    name: "Kai Cipher",
    age: 27,
    bio: "Smart contract auditor | Rock climber | Making the metaverse safer one bug at a time 🦺",
    interests: ["⛰️ Hiking", "🔐 Security", "🎨 Art", "🍳 Cooking"],
    photoUrl: "https://images.unsplash.com/photo-1514626585111-9aa86183ac98?w=400&h=500&fit=crop",
    interests_ids: [10, 7, 6, 3],
  },
  {
    address: "0x1C2D3E4F5A6B7c8d9E0f1A2b3C4D5e6F7a8B9c0D",
    name: "Zeph Chain",
    age: 22,
    bio: "NFT artist 🎨 | Skateboarder | My portfolio is my heart — tokenized & on display.",
    interests: ["🎨 Art", "🎵 Music", "🎬 Movies", "🎮 Gaming"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    interests_ids: [7, 1, 8, 2],
  },
  {
    address: "0x7E8F9A0b1C2d3E4f5A6B7c8D9e0F1a2B3c4D5e6F",
    name: "Luna Vex",
    age: 26,
    bio: "Blockchain researcher @ ETH Foundation | Film photographer | Dog mom 🐶",
    interests: ["📚 Books", "✈️ Travel", "🎬 Movies", "♟️ Chess"],
    photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    interests_ids: [4, 5, 8, 9],
  },
  {
    address: "0x3B4C5D6E7f8A9b0C1d2E3f4A5B6c7D8e9F0a1B2c3",
    name: "Milo Hash",
    age: 29,
    bio: "Layer 2 engineer | Amateur chef | Optimism maxi who's somehow also kind of realistic.",
    interests: ["🍳 Cooking", "🏋️ Fitness", "🎮 Gaming", "🎵 Music"],
    photoUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop",
    interests_ids: [6, 3, 2, 1],
  },
];

const MY_AGE = 23;
const MY_INTERESTS = [1, 5, 7, 2]; // Music, Travel, Art, Gaming

export default function SwipePage() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [deck, setDeck] = useState<CardProfile[]>(DEMO_PROFILES);
  const [matches, setMatches] = useState<CardProfile[]>([]);
  const [showMatch, setShowMatch] = useState<CardProfile | null>(null);
  const [stats, setStats] = useState({ likes: 0, nopes: 0 });

  function handleConnected(s: ethers.Signer, addr: string) {
    setSigner(s);
    setAddress(addr);
  }

  function handleSwipeDone(addr: string, liked: boolean) {
    setDeck(prev => prev.filter(p => p.address !== addr));
    setStats(prev => ({
      likes: prev.likes + (liked ? 1 : 0),
      nopes: prev.nopes + (!liked ? 1 : 0),
    }));
    if (liked) {
      // Simulate a 40% mutual-match rate for demo
      const profile = deck.find(p => p.address === addr)!;
      if (Math.random() < 0.4) {
        setMatches(prev => [...prev, profile]);
        setShowMatch(profile);
        setTimeout(() => setShowMatch(null), 3500);
      }
    }
  }

  const topCard = deck[deck.length - 1];
  const secondCard = deck[deck.length - 2];

  return (
    <main className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">💜</span>
          <span className="font-black text-xl tracking-tight gradient-text">ChainDate</span>
        </a>
        <div className="flex items-center gap-3">
          <Link href="/matches" className="text-sm text-violet-300 hover:text-violet-200 transition">
            Matches {matches.length > 0 && (
              <span className="ml-1 bg-violet-600 text-white text-xs px-1.5 py-0.5 rounded-full">{matches.length}</span>
            )}
          </Link>
          <WalletConnect onConnected={handleConnected} />
        </div>
      </nav>

      {/* Stats bar */}
      <div className="flex justify-center gap-8 py-3 text-sm">
        <span className="text-emerald-400 font-semibold">♥ {stats.likes} Liked</span>
        <span className="text-gray-500 font-mono text-xs mt-0.5">Swipe fee: 0.001 HELA each</span>
        <span className="text-rose-400 font-semibold">✕ {stats.nopes} Noped</span>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {deck.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center max-w-xs">
            <div className="text-6xl mb-2">🌗</div>
            <h2 className="text-2xl font-bold text-white">You&apos;ve seen them all</h2>
            <p className="text-gray-400 text-sm">New profiles are indexed from the blockchain daily. Check your matches!</p>
            <Link
              href="/matches"
              className="mt-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              View Matches →
            </Link>
          </div>
        ) : (
          <div className="relative w-[340px] h-[560px]">
            {/* Background card (depth illusion) */}
            {secondCard && (
              <div
                className="absolute w-[340px] h-[520px] rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 border border-white/5 shadow-xl"
                style={{ transform: "scale(0.94) translateY(18px)", zIndex: 0 }}
              />
            )}
            {/* Top swipeable card */}
            {topCard && (
              <div style={{ zIndex: 10, position: "absolute", inset: 0 }}>
                <SwipeCard
                  key={topCard.address}
                  profile={topCard}
                  myInterestIds={MY_INTERESTS}
                  myAge={MY_AGE}
                  signer={signer}
                  onSwipeDone={handleSwipeDone}
                />
              </div>
            )}
          </div>
        )}

        {/* Swipe hint */}
        {deck.length > 0 && (
          <p className="mt-20 text-gray-600 text-xs text-center">
            Drag card or use buttons · Each swipe costs 0.001 HELA
          </p>
        )}
      </div>

      {/* Match toast notification */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto glass rounded-3xl border border-fuchsia-500/40 shadow-2xl shadow-fuchsia-900/40 p-8 flex flex-col items-center gap-4 max-w-xs mx-4 animate-bounce-once">
            <div className="text-5xl">🎉</div>
            <div className="text-center">
              <h3 className="text-2xl font-black gradient-text mb-1">It&apos;s a Match!</h3>
              <p className="text-gray-300 text-sm">You and <span className="text-white font-semibold">{showMatch.name}</span> liked each other.</p>
              <p className="text-gray-500 text-xs mt-1">ZK proof verified on-chain ✓</p>
            </div>
            <div className="flex -space-x-3">
              <img src={showMatch.photoUrl} alt="" className="w-14 h-14 rounded-full border-2 border-fuchsia-500 object-cover" />
              <div className="w-14 h-14 rounded-full border-2 border-violet-500 bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl z-10">💜</div>
            </div>
            <Link
              href="/matches"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              Send a Message →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";
import MatchCard from "@/components/MatchCard";
import ContentUnlock from "@/components/ContentUnlock";

interface Message {
  from: string;
  text: string;
  ts: number;
}

// Mock matches for demo (replace with on-chain event indexing)
const MOCK_MATCHES = [
  {
    address: "0x4A3B8fEa2D9C1F5e6D7b0A9c3E2F8B1d4C5A6B7C",
    name: "Aria Nova",
    photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop",
  },
  {
    address: "0x9F2A1b3C4d5E6f7A8B9c0D1e2F3a4B5c6D7e8F9a",
    name: "Kai Cipher",
    photoUrl: "https://images.unsplash.com/photo-1514626585111-9aa86183ac98?w=80&h=80&fit=crop",
  },
];

const MOCK_CONTENT = [
  {
    listingId: 0,
    creator: "0x4A3B8fEa2D9C1F5e6D7b0A9c3E2F8B1d4C5A6B7C",
    contentName: "🎵 Aria's Exclusive Beat Pack",
    price: ethers.parseEther("0.02"),
    previewUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop",
  },
];

export default function MatchesPage() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<(typeof MOCK_MATCHES)[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { from: "0x4A3B8fEa2D9C1F5e6D7b0A9c3E2F8B1d4C5A6B7C", text: "Hey! Looks like we matched 💜 Love that you're into music too!", ts: Date.now() - 60000 },
    { from: "me", text: "Haha yes! I saw you play jazz piano, that's so cool 🎹", ts: Date.now() - 30000 },
  ]);
  const [msgInput, setMsgInput] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [unlockedContent, setUnlockedContent] = useState<number[]>([]);

  function handleConnected(s: ethers.Signer, addr: string) {
    setSigner(s);
    setAddress(addr);
  }

  async function handleSendMessage() {
    if (!msgInput.trim()) return;
    const MSG_FEE = ethers.parseEther("0.0005");

    if (signer && activeChat) {
      setTxPending(true);
      try {
        const { getDatingCoreContract } = await import("@/lib/contracts");
        const contract = getDatingCoreContract(signer);
        const tx = await contract.sendMessage(activeChat.address, { value: MSG_FEE });
        await tx.wait();
      } catch (err) {
        console.warn("Message tx (demo mode — chain not connected):", err);
      } finally {
        setTxPending(false);
      }
    }

    setMessages(prev => [...prev, { from: "me", text: msgInput.trim(), ts: Date.now() }]);
    setMsgInput("");
  }

  return (
    <main className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">💜</span>
            <span className="font-black text-xl tracking-tight gradient-text">ChainDate</span>
          </a>
          <Link href="/swipe" className="text-sm text-gray-400 hover:text-violet-300 transition">← Swipe</Link>
        </div>
        <WalletConnect onConnected={handleConnected} />
      </nav>

      <div className="flex flex-1 overflow-hidden max-h-[calc(100vh-73px)]">
        {/* Matches sidebar */}
        <aside className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-white/5 glass overflow-y-auto`}>
          <div className="p-5 border-b border-white/5">
            <h1 className="text-xl font-bold text-white">Your Matches</h1>
            <p className="text-xs text-gray-500 mt-0.5">On-chain verified · ZK proven</p>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {MOCK_MATCHES.map(match => (
              <MatchCard
                key={match.address}
                {...match}
                lastMessage={match.address === MOCK_MATCHES[0].address ? "Hey! Looks like we matched 💜" : undefined}
                onClick={() => setActiveChat(match)}
              />
            ))}
          </div>

          {/* Exclusive content section */}
          <div className="p-5 border-t border-white/5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              🔒 Exclusive Content
              <span className="text-[10px] text-gray-500 font-normal">Pay to unlock · Escrow secured</span>
            </h2>
            <div className="flex flex-col gap-3">
              {MOCK_CONTENT.map(c => (
                <ContentUnlock
                  key={c.listingId}
                  {...c}
                  signer={signer}
                  onUnlocked={(id) => setUnlockedContent(prev => [...prev, id])}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Chat panel */}
        {activeChat ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-4 glass border-b border-white/5 flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-400 hover:text-white mr-1">←</button>
              <img src={activeChat.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-white text-sm">{activeChat.name}</p>
                <p className="text-[10px] text-gray-500 font-mono">{activeChat.address.slice(0, 10)}…{activeChat.address.slice(-6)}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Matched on-chain
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              <div className="flex justify-center">
                <span className="text-[10px] text-gray-600 bg-gray-900/60 px-3 py-1 rounded-full">ZK-verified match · E2E encrypted chat</span>
              </div>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "me"
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                        : "glass border border-white/10 text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost notice */}
            <div className="px-5 py-1.5 text-center">
              <span className="text-[10px] text-gray-600">Each message costs 0.0005 HELA · 80% to recipient, 20% protocol</span>
            </div>

            {/* Message input */}
            <div className="p-4 glass border-t border-white/5 flex gap-3">
              <input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Write a message…"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                disabled={txPending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!msgInput.trim() || txPending}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {txPending ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : "Send →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-3 text-center">
            <div className="text-5xl">💬</div>
            <p className="text-lg font-semibold text-white">Select a match to chat</p>
            <p className="text-gray-500 text-sm max-w-xs">Each message is a micro-transaction on Hela Network. Privacy-first E2E encrypted.</p>
          </div>
        )}
      </div>
    </main>
  );
}

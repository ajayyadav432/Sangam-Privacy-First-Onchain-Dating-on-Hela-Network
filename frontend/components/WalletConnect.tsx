"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { switchToHelaNetwork } from "@/lib/contracts";

interface WalletConnectProps {
  onConnected: (signer: ethers.Signer, address: string) => void;
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    if (!window.ethereum) {
      setError("No Ethereum wallet found. Install MetaMask.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await switchToHelaNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      onConnected(signer, addr);
    } catch (err: any) {
      setError(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-mono text-emerald-300">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <span className="text-xs text-emerald-500/60 ml-1">Hela Network</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={connect}
        disabled={loading}
        className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Connect Wallet
          </span>
        )}
      </button>
      {error && <p className="text-rose-400 text-xs text-center max-w-xs">{error}</p>}
    </div>
  );
}

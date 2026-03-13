"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import WalletConnect from "@/components/WalletConnect";
import ProfileForm from "@/components/ProfileForm";

export default function RegisterPage() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();

  function handleConnected(s: ethers.Signer, addr: string) {
    setSigner(s);
    setAddress(addr);
  }

  function handleRegistered() {
    router.push("/swipe");
  }

  return (
    <main className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">💜</span>
          <span className="font-black text-xl tracking-tight gradient-text">Sangam</span>
        </a>
        <WalletConnect onConnected={handleConnected} />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass rounded-3xl p-8 border border-violet-500/10 shadow-2xl shadow-violet-900/20">
          {!address ? (
            <div className="flex flex-col items-center gap-6 text-center py-8">
              <div className="text-5xl">🔐</div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Connect to Register</h1>
                <p className="text-gray-400 text-sm">You need a wallet to create your encrypted on-chain profile.</p>
              </div>
              <WalletConnect onConnected={handleConnected} />
            </div>
          ) : (
            <ProfileForm
              signer={signer!}
              address={address}
              onRegistered={handleRegistered}
            />
          )}
        </div>
      </div>
    </main>
  );
}


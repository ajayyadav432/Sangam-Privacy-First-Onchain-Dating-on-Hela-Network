"use client";
import React, { useState, useRef, useCallback } from "react";
import { ethers } from "ethers";
import { getDatingCoreContract } from "@/lib/contracts";
import { generateMockProof, encodeProofForContract, validateProofLocally } from "@/lib/zk";

export interface CardProfile {
  address: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  photoUrl: string;
  interests_ids: number[];
}

interface SwipeCardProps {
  profile: CardProfile;
  myInterestIds: number[];
  myAge: number;
  signer: ethers.Signer | null;
  onSwipeDone: (address: string, liked: boolean) => void;
}

const SWIPE_THRESHOLD = 100; // px before deciding swipe direction
const SWIPE_FEE = ethers.parseEther("0.001");

export default function SwipeCard({
  profile,
  myInterestIds,
  myAge,
  signer,
  onSwipeDone,
}: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [swipeResult, setSwipeResult] = useState<"liked" | "noped" | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const rotation = dragX * 0.08;
  const likeOpacity = Math.max(0, Math.min(1, dragX / SWIPE_THRESHOLD));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / SWIPE_THRESHOLD));

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (txPending || swipeResult) return;
    setIsDragging(true);
    startX.current = e.clientX - dragX;
    startY.current = e.clientY - dragY;
    cardRef.current?.setPointerCapture(e.pointerId);
  }, [dragX, dragY, txPending, swipeResult]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
    setDragY(e.clientY - startY.current);
  }, [isDragging]);

  const settle = useCallback(async (liked: boolean) => {
    const dir = liked ? 1 : -1;
    setDragX(dir * 600);
    setSwipeResult(liked ? "liked" : "noped");
    setIsDragging(false);

    if (signer) {
      setTxPending(true);
      try {
        const proof = await generateMockProof({
          age: myAge,
          userInterests: myInterestIds,
          targetInterests: profile.interests_ids,
        });
        const validation = validateProofLocally(proof);
        if (!validation.valid) {
          alert(`ZK Validation failed: ${validation.reason}`);
          setTxPending(false);
          return;
        }
        const { proofCalldata, signalsCalldata } = encodeProofForContract(proof);
        const contract = getDatingCoreContract(signer);
        const tx = await contract.swipe(
          profile.address, liked, proofCalldata, signalsCalldata,
          { value: SWIPE_FEE }
        );
        await tx.wait();
      } catch (err: any) {
        console.error("Swipe tx failed:", err.message);
      } finally {
        setTxPending(false);
      }
    }
    setTimeout(() => onSwipeDone(profile.address, liked), 400);
  }, [signer, myAge, myInterestIds, profile, onSwipeDone]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > SWIPE_THRESHOLD) settle(true);
    else if (dragX < -SWIPE_THRESHOLD) settle(false);
    else { setDragX(0); setDragY(0); }
  }, [isDragging, dragX, settle]);

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        transform: `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.4s cubic-bezier(.17,.67,.36,1.2)",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      className="absolute w-[340px] h-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 select-none"
    >
      {/* Profile photo */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        {/* LIKE badge */}
        <div
          className="absolute top-6 left-6 px-4 py-1.5 rounded-full border-2 border-emerald-400 text-emerald-400 font-black text-xl tracking-widest uppercase rotate-[-20deg]"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>
        {/* NOPE badge */}
        <div
          className="absolute top-6 right-6 px-4 py-1.5 rounded-full border-2 border-rose-500 text-rose-500 font-black text-xl tracking-widest uppercase rotate-[20deg]"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </div>
      </div>

      {/* Profile info */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
          <span className="text-lg text-gray-400">{profile.age}</span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{profile.bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {profile.interests.slice(0, 5).map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-0.5 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Wallet address & tx state */}
      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
        <span className="text-[10px] text-gray-600 font-mono truncate max-w-[160px]">
          {profile.address.slice(0, 8)}…{profile.address.slice(-6)}
        </span>
        {txPending && (
          <div className="flex items-center gap-1.5 text-xs text-yellow-400 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            tx pending…
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-5">
        <button
          onClick={() => settle(false)}
          disabled={txPending || !!swipeResult}
          className="w-14 h-14 rounded-full bg-gray-900 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 text-xl hover:bg-rose-500/10 hover:scale-110 transition-all disabled:opacity-40"
          title="Nope"
        >✕</button>
        <button
          onClick={() => settle(true)}
          disabled={txPending || !!swipeResult}
          className="w-14 h-14 rounded-full bg-gray-900 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 text-xl hover:bg-emerald-500/10 hover:scale-110 transition-all disabled:opacity-40"
          title="Like"
        >♥</button>
      </div>
    </div>
  );
}

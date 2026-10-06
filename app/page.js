"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "./layout/Header";
import { StoreContext, useContext, observer } from "./Mobx";

const Page = observer(() => {
  const store = useContext(StoreContext);
  const [name, setName] = useState("");

  if (store.profile.name) {
    if (typeof window !== "undefined") window.location.href = "/pokedex";
    return null;
  }

  const start = () => {
    if (!name.trim()) return;
    store.setTrainer(name);
    window.location.href = "/pokedex";
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center px-6 pt-10 pb-16">
        <img src="/imgs/login-hero.webp" width="300" alt="RL Pokedex" className="rounded-3xl shadow-lg" />
        <h1 className="text-3xl font-black mt-6 tracking-wide">RL POKEDEX</h1>
        <p className="text-zinc-500 mt-1 mb-6 text-center">
          Snap anything in real life.
          <br />
          Get its Pokédex entry.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="Your trainer name"
          maxLength={24}
          className="w-full max-w-[320px] border-2 border-zinc-300 rounded-xl px-4 py-3 text-lg text-center font-semibold outline-none focus:border-[#E4383B]"
        />
        <button className="big-btn mt-4" onClick={start}>
          ▶ START
        </button>
        <Link href="/camera" className="big-btn secondary">
          📷 SCAN
        </Link>
        <p className="text-xs text-zinc-400 mt-6 text-center max-w-[300px]">
          No account needed. Your collection lives on this device&apos;s trainer name.
        </p>
      </div>
    </>
  );
});

export default Page;

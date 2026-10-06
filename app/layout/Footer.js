"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#222] text-white">
      <nav className="flex justify-around py-3 text-sm font-semibold">
        <Link href="/pokedex" className="px-4 py-1">📖 Dex</Link>
        <Link href="/camera" className="px-4 py-1 text-2xl leading-none">📷</Link>
        <Link href="/leaderboard" className="px-4 py-1">🏆 Board</Link>
      </nav>
    </footer>
  );
}

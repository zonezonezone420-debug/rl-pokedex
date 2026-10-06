"use client";
import { useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { StoreContext, useContext, observer } from "../../Mobx";

function Stat({ label, value }) {
  const pct = Math.min(100, Math.max(0, (value / 150) * 100));
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="stat-bar">
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const Preview = observer(() => {
  const store = useContext(StoreContext);
  const [confirming, setConfirming] = useState(false);
  const c = store.capture;

  if (!c || !c._id) {
    if (typeof window !== "undefined") window.location.href = "/pokedex";
    return null;
  }

  const speak = async () => {
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capture: c }),
      });
      const data = await res.json();
      if (data.capture?.voiceUrl) {
        new Audio(data.capture.voiceUrl).play();
      } else {
        alert("Voice narration isn't available in this build yet.");
      }
    } catch {
      alert("Voice narration isn't available in this build yet.");
    }
  };

  return (
    <>
      <Header />
      <div className={`min-h-screen type-soft-${c.type || "normal"} px-4 pt-4 pb-10`}>
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          {c.image && <img src={c.image} alt={c.species} className="w-full aspect-square object-cover" />}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black">{c.species || "???"}</h1>
              <span className={`text-sm font-bold text-white px-3 py-1 rounded-full type-bg-${c.type || "normal"}`}>
                {(c.type || "normal").toUpperCase()}
              </span>
            </div>
            {c.demo && (
              <p className="text-xs text-amber-600 font-semibold mt-1">
                Demo entry — add an OpenAI API key for real photo analysis.
              </p>
            )}
            <p className="text-zinc-600 mt-3 italic">{c.description}</p>
            <div className="grid grid-cols-2 gap-x-4 text-sm mt-4 mb-4">
              <p><span className="font-semibold">Object:</span> {c.object}</p>
              <p><span className="font-semibold">Weight:</span> {c.approximateWeight}</p>
              <p><span className="font-semibold">Height:</span> {c.approximateHeight}</p>
            </div>
            <Stat label="HP" value={c.hp} />
            <Stat label="Attack" value={c.attack} />
            <Stat label="Defense" value={c.defense} />
            <Stat label="Speed" value={c.speed} />
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-[#3b82f6] text-white font-bold py-3 rounded-xl" onClick={speak}>
                🔊 Voice
              </button>
              {!confirming ? (
                <button
                  className="flex-1 bg-zinc-200 text-zinc-700 font-bold py-3 rounded-xl"
                  onClick={() => setConfirming(true)}
                >
                  🗑 Release
                </button>
              ) : (
                <button
                  className="flex-1 bg-[#E4383B] text-white font-bold py-3 rounded-xl"
                  onClick={() => store.deletePokemon()}
                >
                  Confirm release?
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
});

export default Preview;

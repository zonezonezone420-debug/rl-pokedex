"use client";
import { useEffect } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { StoreContext, useContext, observer } from "../Mobx";

const Leaderboard = observer(() => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.getLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <>
      <Header />
      <div className="px-4 pt-6 max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-4 text-center">🏆 LEADERBOARD</h1>
        {store.leaderboardRefresh ? (
          <p className="text-center text-zinc-500">Loading…</p>
        ) : store.leaderboard.length === 0 ? (
          <p className="text-center text-zinc-500 mt-10">
            No trainers yet.
            <br />
            Be the first to dex something.
          </p>
        ) : (
          <div className="space-y-2 pb-8">
            {store.leaderboard.map((t, i) => (
              <div
                key={t.name}
                className={`flex items-center gap-3 p-3 rounded-xl shadow ${
                  t.name === store.profile.name ? "bg-amber-100 border-2 border-amber-400" : "bg-white"
                }`}
              >
                <span className="text-2xl w-8 text-center">{medals[i] || `#${i + 1}`}</span>
                <div className="flex-1">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.count} capture{t.count === 1 ? "" : "s"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
});

export default Leaderboard;

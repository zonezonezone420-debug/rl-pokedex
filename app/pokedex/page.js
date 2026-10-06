"use client";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { StoreContext, useContext, observer } from "../Mobx";

const Pokedex = observer(() => {
  const store = useContext(StoreContext);

  if (!store.profile.name) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <>
      <Header />
      <div className="px-4 pt-4 max-w-xl mx-auto">
        <input
          value={store.keyword}
          onChange={(e) => (store.keyword = e.target.value)}
          placeholder="Search by name or type…"
          className="w-full border-2 border-zinc-300 rounded-xl px-4 py-2 mb-4 outline-none focus:border-[#E4383B]"
        />
        {store.filteredPokemon.length === 0 ? (
          <div className="text-center text-zinc-500 mt-16">
            <p className="text-5xl mb-4">📷</p>
            <p className="font-semibold">No captures yet.</p>
            <p className="text-sm mt-1">Hit the camera and dex something.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {store.filteredPokemon.map((poke) => (
              <div
                key={poke._id}
                className={`dex-card type-soft-${poke.type || "normal"}`}
                onClick={() => store.viewPoke(poke)}
              >
                {poke.image ? (
                  <img src={poke.image} alt={poke.species} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-zinc-200 flex items-center justify-center text-4xl">❔</div>
                )}
                <div className="p-3">
                  <p className="font-extrabold truncate">{poke.species || "???"}</p>
                  <span
                    className={`inline-block text-xs font-bold text-white px-2 py-0.5 rounded-full mt-1 type-bg-${poke.type || "normal"}`}
                  >
                    {(poke.type || "normal").toUpperCase()}
                  </span>
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

export default Pokedex;

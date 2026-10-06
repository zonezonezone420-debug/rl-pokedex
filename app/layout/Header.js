"use client";
import Link from "next/link";
import { StoreContext, useContext, observer } from "../Mobx";

const Header = observer(() => {
  const store = useContext(StoreContext);
  return (
    <header className="sticky top-0 z-10 bg-[#E4383B] text-white px-4 py-3 flex items-center justify-between shadow">
      <Link href={store.profile.name ? "/pokedex" : "/"} className="font-bold text-xl tracking-wide">
        ▲ RL Pokedex
      </Link>
      {store.profile.name ? (
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-90">{store.profile.name}</span>
          <button
            className="underline opacity-80"
            onClick={() => {
              store.signOut();
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
});

export default Header;

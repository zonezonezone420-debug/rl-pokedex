"use client";

import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";
import AppStore from "./store";

let store;

function initializeStore() {
  const _store = store ?? new AppStore();
  if (typeof window === "undefined") return _store;
  if (!store) store = _store;
  if (!window.store) window.store = store;
  return _store;
}

const StoreContext = createContext(null);

export function MobxProvider({ children }) {
  const s = initializeStore();
  return <StoreContext.Provider value={s}>{children}</StoreContext.Provider>;
}

export { observer, useContext, StoreContext };
export default MobxProvider;

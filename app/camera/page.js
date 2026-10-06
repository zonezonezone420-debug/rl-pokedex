"use client";
import { useRef } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { StoreContext, useContext, observer } from "../Mobx";

const Camera = observer(() => {
  const store = useContext(StoreContext);
  const inputRef = useRef(null);

  if (!store.profile.name) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center px-6 pt-10">
        <h1 className="text-2xl font-black mb-2">📷 SCAN</h1>
        <p className="text-zinc-500 text-center mb-6">
          Point at anything real.
          <br />
          The Dex does the rest.
        </p>
        {store.picture.loadingContent ? (
          <div className="text-center mt-10">
            <p className="text-5xl mb-4 animate-bounce">⚡</p>
            <p className="font-bold text-lg">Analyzing…</p>
            <p className="text-sm text-zinc-500 mt-1">Writing your Pokédex entry</p>
          </div>
        ) : (
          <>
            <button className="big-btn" onClick={() => inputRef.current?.click()}>
              TAKE PHOTO
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => store.handleCaptureImage(e)}
            />
            <p className="text-xs text-zinc-400 mt-4 text-center">
              Uses your camera. On desktop you can upload a photo instead.
            </p>
          </>
        )}
      </div>
      <Footer />
    </>
  );
});

export default Camera;

"use client";
import { makeAutoObservable, configure } from "mobx";
import Resizer from "react-image-file-resizer";

configure({ enforceActions: "never" });

const CAPTURE_SCHEMA = {
  object: "",
  image: "",
  species: "",
  approximateWeight: "",
  approximateHeight: "",
  weight: 0,
  height: 0,
  hp: 0,
  attack: 0,
  defense: 0,
  speed: 0,
  type: "",
  description: "",
  voiceJobToken: "",
  voicePath: "",
  voiceStatus: "",
  voiceUrl: "",
};

class AppStore {
  profile = { name: "", email: "", avatar: "" };
  pokemon = [];
  leaderboard = [];
  keyword = "";
  capture = { ...CAPTURE_SCHEMA };
  picture = { buttonPressed: false, loadingContent: false };
  leaderboardRefresh = false;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("rlpokedex_trainer");
      if (saved) {
        this.profile = { name: saved, email: "", avatar: "" };
        this.getPokemon();
        this.getLeaderboard();
      }
    }
  }

  get trainer() {
    return this.profile.name || "trainer";
  }

  setTrainer(name) {
    this.profile = { name: name.trim(), email: "", avatar: "" };
    window.localStorage.setItem("rlpokedex_trainer", name.trim());
    this.getPokemon();
    this.getLeaderboard();
  }

  signOut() {
    this.profile = { name: "", email: "", avatar: "" };
    this.pokemon = [];
    window.localStorage.removeItem("rlpokedex_trainer");
  }

  get filteredPokemon() {
    const kw = this.keyword.toLowerCase();
    return this.pokemon.filter(
      (poke) =>
        (poke.object || "").toLowerCase().includes(kw) ||
        (poke.type || "").toLowerCase().includes(kw) ||
        (poke.species || "").toLowerCase().includes(kw)
    );
  }

  getPokemon = async () => {
    const res = await fetch(`/api/pokemon?trainer=${encodeURIComponent(this.trainer)}`);
    const data = await res.json();
    this.pokemon = data.pokemon || [];
  };

  getLeaderboard = async () => {
    this.leaderboardRefresh = true;
    this.leaderboard = [];
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    this.leaderboard = [...(data.leaderboard || [])];
    this.leaderboardRefresh = false;
  };

  deletePokemon = async () => {
    const _id = this.capture._id;
    await fetch("/api/pokemon/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id, trainer: this.trainer }),
    });
    this.capture = { ...CAPTURE_SCHEMA };
    await this.getPokemon();
    window.location.href = "/pokedex";
  };

  handleCaptureImage = async (file) => {
    this.capture = { ...CAPTURE_SCHEMA };
    this.picture.buttonPressed = true;
    this.picture.loadingContent = true;
    if (file.target) {
      file = file.target.files[0];
      file = await new Promise((resolve) => {
        Resizer.imageFileResizer(
          file, 512, 512, "JPEG", 100, 0,
          (uri) => resolve(uri),
          "base64"
        );
      });
    }
    this.capture.image = file;
    this.analysisCapture();
  };

  analysisCapture = async () => {
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capture: this.capture, trainer: this.trainer }),
      });
      const data = await res.json();
      this.capture = { ...data.entry, image: this.capture.image };
      if (
        this.capture.description !== "No object identified." &&
        this.capture.description !== "No object detected."
      ) {
        this.pokemon.unshift(this.capture);
      }
    } catch (e) {
      console.error(e);
    }
    this.picture.buttonPressed = false;
    this.picture.loadingContent = false;
    window.location.href = "/pokedex/preview";
  };

  viewPoke = (poke) => {
    this.capture = { ...poke };
    window.location.href = "/pokedex/preview";
  };
}

export default AppStore;

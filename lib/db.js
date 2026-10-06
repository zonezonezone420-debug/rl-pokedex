import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { users: {}, pokemon: [] };
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function getOrCreateUser(name) {
  const db = await readDb();
  const key = name.trim().toLowerCase();
  if (!db.users[key]) {
    db.users[key] = {
      name: name.trim(),
      avatar: "",
      created: new Date().toISOString(),
    };
    await writeDb(db);
  }
  return db.users[key];
}

export async function saveEntry(trainer, entry) {
  const db = await readDb();
  const saved = {
    _id: randomUUID(),
    trainer: trainer.trim().toLowerCase(),
    created: new Date().toISOString(),
    ...entry,
  };
  db.pokemon.unshift(saved);
  await writeDb(db);
  return saved;
}

export async function listEntries(trainer) {
  const db = await readDb();
  const key = trainer.trim().toLowerCase();
  return db.pokemon.filter((p) => p.trainer === key);
}

export async function deleteEntry(trainer, id) {
  const db = await readDb();
  const key = trainer.trim().toLowerCase();
  db.pokemon = db.pokemon.filter((p) => !(p._id === id && p.trainer === key));
  await writeDb(db);
  return true;
}

export async function getLeaderboard() {
  const db = await readDb();
  const counts = {};
  for (const p of db.pokemon) {
    counts[p.trainer] = (counts[p.trainer] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([trainer, count]) => ({
      name: db.users[trainer]?.name || trainer,
      avatar: db.users[trainer]?.avatar || "",
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

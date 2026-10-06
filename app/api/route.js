import { NextResponse } from "next/server";
import { getOrCreateUser, saveEntry } from "@/lib/db";

const SCHEMA_HINT = `Return ONLY valid JSON with these keys: object, species, approximateWeight, approximateHeight, hp, attack, defense, speed, type, description. type must be one of: normal, fire, water, electric, grass, ice, fighting, poison, earth, flying, psychic, bug, stone, ghost, dragon, dark, metal, fairy, inanimate. hp/attack/defense/speed are integers 1-150. description is a one or two sentence Pokedex-style entry. species is a creative creature name.`;

const DEMO_ROSTER = [
  { species: "Lampentoad", type: "electric", description: "It stores static in its cheeks and croaks in Morse code when excited." },
  { species: "Sofaquil", type: "normal", description: "A docile beast. It naps sixteen hours a day and sheds crumbs." },
  { species: "Mugmoth", type: "bug", description: "Drawn to warm drinks. Its wings smell faintly of coffee." },
  { species: "Keyper", type: "metal", description: "It jingles when danger is near. Nobody knows what it unlocks." },
  { species: "Bottlecrab", type: "water", description: "It wears discarded shells as armor and pinches with pride." },
  { species: "Cacthog", type: "grass", description: "Its spines are soft until it feels threatened. Then, less soft." },
];

function demoEntry() {
  const pick = DEMO_ROSTER[Math.floor(Math.random() * DEMO_ROSTER.length)];
  const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  return {
    object: "mystery object",
    species: pick.species,
    approximateWeight: `${r(1, 40)} lbs`,
    approximateHeight: `${r(1, 48)} in`,
    weight: 0,
    height: 0,
    hp: r(20, 120),
    attack: r(10, 130),
    defense: r(10, 130),
    speed: r(10, 130),
    type: pick.type,
    description: pick.description + " (Demo mode: add an OPENAI_API_KEY for real photo analysis.)",
    demo: true,
  };
}

async function analyzeWithOpenAI(image) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Look at this photo of a real-world object. Invent a Pokemon-style entry for it as if it were a newly discovered creature. ${SCHEMA_HINT}`,
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Vision API error: ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Vision API returned no JSON");
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req) {
  try {
    const { capture, trainer } = await req.json();
    if (!capture?.image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const trainerName = (trainer || "trainer").toString();
    await getOrCreateUser(trainerName);

    let entry;
    if (process.env.OPENAI_API_KEY) {
      try {
        entry = await analyzeWithOpenAI(capture.image);
      } catch (e) {
        console.error("Vision failed, falling back to demo:", e.message);
        entry = demoEntry();
      }
    } else {
      entry = demoEntry();
    }

    const saved = await saveEntry(trainerName, {
      ...entry,
      image: capture.image,
      voiceJobToken: "",
      voicePath: "",
      voiceStatus: "",
      voiceUrl: "",
    });
    return NextResponse.json({ entry: saved });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

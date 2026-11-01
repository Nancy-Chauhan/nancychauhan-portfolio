// Checks that every YouTube video linked on the site is still public.
// Exits 1 and prints the missing ones if any were removed or made private.
// Usage: node scripts/check-videos.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const ytId = (url) => url?.match(/(?:v=|youtu\.be\/|\/)([\w-]{11})/)?.[1];
const talks = JSON.parse(fs.readFileSync(path.join(root, "src/data/talks/talks.json"), "utf8"));
const courses = JSON.parse(fs.readFileSync(path.join(root, "src/data/courses.json"), "utf8"));

const videos = [
  ...talks.filter((t) => t.video && !t.unavailable).map((t) => ({ id: ytId(t.video), title: t.title, where: "talks.json", noEmbed: t.noEmbed })),
  ...courses.flatMap((c) => c.lessons.filter((l) => !l.unavailable).map((l) => ({ id: l.id, title: `${c.title} — ${l.title}`, where: "courses.json" }))),
];

const missing = [];
const embedBlocked = [];
for (const v of videos) {
  // oEmbed answers 200 for public, embeddable videos.
  const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.id}`)}`);
  if (res.status === 200) continue;
  // Otherwise check the watch page: public-but-not-embeddable vs. gone.
  const page = await (await fetch(`https://www.youtube.com/watch?v=${v.id}`, { headers: { "Accept-Language": "en" } })).text();
  const playable = /"playabilityStatus":\{"status":"OK"/.test(page);
  if (playable && /"playableInEmbed":false/.test(page)) {
    if (!v.noEmbed) embedBlocked.push(v);
  } else {
    missing.push({ ...v, status: res.status });
  }
}

console.log(`Checked ${videos.length} videos.`);
if (embedBlocked.length) {
  console.log(`\n${embedBlocked.length} public but can't be embedded (set "noEmbed": true so the card opens YouTube):\n`);
  for (const m of embedBlocked) console.log(`- ${m.title} — https://youtu.be/${m.id} (${m.where})`);
}
if (missing.length) {
  console.log(`\n${missing.length} no longer public:\n`);
  for (const m of missing) console.log(`- [${m.status}] ${m.title} — https://youtu.be/${m.id} (${m.where})`);
  console.log(`\nFix: set "unavailable": true on these entries so the site shows "No longer public" instead of a broken player.`);
  process.exit(1);
}
if (embedBlocked.length) process.exit(1);
console.log("All videos are public.");

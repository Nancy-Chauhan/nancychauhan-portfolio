// Saves a local copy of every YouTube thumbnail used on the site into public/talks/<id>.jpg,
// so cards keep their artwork even if a video is later removed or made private.
// Usage: node scripts/fetch-video-thumbs.mjs   (skips thumbnails already saved)
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const outDir = path.join(root, "public/talks");
fs.mkdirSync(outDir, { recursive: true });

const ytId = (url) => url?.match(/(?:v=|youtu\.be\/|\/)([\w-]{11})/)?.[1];
const talks = JSON.parse(fs.readFileSync(path.join(root, "src/data/talks/talks.json"), "utf8"));
const courses = JSON.parse(fs.readFileSync(path.join(root, "src/data/courses.json"), "utf8"));
const ids = new Set([
  ...talks.map((t) => ytId(t.video)).filter(Boolean),
  ...courses.flatMap((c) => c.lessons.map((l) => l.id)),
]);

let saved = 0, skipped = 0, failed = [];
for (const id of ids) {
  const file = path.join(outDir, `${id}.jpg`);
  if (fs.existsSync(file)) { skipped++; continue; }
  let ok = false;
  for (const quality of ["maxresdefault", "sddefault", "hqdefault"]) {
    const res = await fetch(`https://img.youtube.com/vi/${id}/${quality}.jpg`);
    // A missing size comes back as 404 with a tiny grey placeholder; try the next size.
    if (!res.ok) continue;
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    ok = true;
    break;
  }
  ok ? saved++ : failed.push(id);
}
console.log(`thumbnails: ${saved} saved, ${skipped} already present${failed.length ? `, failed: ${failed.join(", ")}` : ""}`);

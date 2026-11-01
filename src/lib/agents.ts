// Shared, data-driven views of talks, community and courses for agent-facing files
// (llms.txt, llms-full.txt, api/site.json), so they always match what the pages show.
import talks from "../data/talks/talks.json";
import courses from "../data/courses.json";
import community from "../data/community.json";
import { absoluteUrl } from "./discovery";

type Talk = (typeof talks)[number] & { highlight?: { label: string; photo: string; post?: string }; date?: string; noEmbed?: boolean; unavailable?: boolean };

const isTeaching = (t: Talk) => t.type === "Webinar" || t.type === "Explainer";
const newestFirst = (a: Talk, b: Talk) => b.year - a.year || (b.date ?? "").localeCompare(a.date ?? "");

export const allTalks = talks as Talk[];
export const keynote = allTalks.find((t) => t.highlight);
export const conferenceTalks = allTalks.filter((t) => !isTeaching(t)).sort(newestFirst);
export const webinars = allTalks.filter(isTeaching).sort(newestFirst);
export const talkCategory = (t: Talk) => (isTeaching(t) ? "webinar-or-explainer" : "conference-or-meetup");

const seconds = (d: string) => d.split(":").reduce((total, part) => total * 60 + Number(part), 0);
export const courseList = courses.map((c) => ({
  ...c,
  lessonCount: c.lessons.length,
  totalMinutes: Math.round(c.lessons.reduce((sum, l) => sum + seconds(l.duration), 0) / 60),
}));

export const founded = {
  ...community.founded,
  // The page caption refers to a photo; agents get a photo-free version.
  story: community.founded.story.replace("the women in this photo", "the women at that meetup"),
};
export const communityEvents = [...community.events].sort((a, b) => b.sortDate.localeCompare(a.sortDate));

export const talkLine = (t: Talk) =>
  `- ${t.title} — ${t.event}, ${t.year}${t.coSpeaker ? ` (with ${t.coSpeaker})` : ""}${t.video ? ` — ${t.video}` : ""}`;

export const eventLine = (e: (typeof community.events)[number]) =>
  `- ${e.role}: ${e.title} (${e.year}) — ${e.detail} — ${e.url}`;

export const pageIndex = [
  { name: "Home", url: absoluteUrl("/"), description: "Overview: role, featured projects, AI agent writing, talks, recognition and testimonials." },
  { name: "About", url: absoluteUrl("/about"), description: "Biography, experience, education, skills, annual reflections and life beyond work." },
  { name: "Projects", url: absoluteUrl("/projects"), description: "Products, AI agents, developer tools and security projects she has built." },
  { name: "Blog", url: absoluteUrl("/blog"), description: "All articles: AI agents in production, engineering notes and year-in-review posts." },
  { name: "Speaking", url: absoluteUrl("/speaking"), description: "Keynote, conference talks, webinars, explainers and video courses." },
  { name: "Community", url: absoluteUrl("/community"), description: "Women in Cloud Native, CNCF TAG leadership, events organised and spoken at, recognition and testimonials." },
];

import { getSiteContent } from "@/lib/actions/admin";
import AboutContentEditor from "@/components/admin/AboutContentEditor";

export const metadata = { title: "About Page | Admin" };

export default async function AdminAboutPage() {
  const keys = [
    "about_hero", "about_story", "about_pillars", "about_stats",
    "about_mission", "about_values", "about_timeline", "about_team",
  ];
  const results = await Promise.all(keys.map((k) => getSiteContent(k)));

  const parse = <T,>(raw: string | null): T | undefined => {
    if (!raw) return undefined;
    try { return JSON.parse(raw) as T; } catch { return undefined; }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">About Page</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Manage every section of the public About page — hero, story, timeline, stats, values and more.
        </p>
      </div>

      <AboutContentEditor
        initialHero={parse(results[0])}
        initialStory={parse(results[1])}
        initialPillars={parse(results[2])}
        initialStats={parse(results[3])}
        initialMission={parse(results[4])}
        initialValues={parse(results[5])}
        initialTimeline={parse(results[6])}
        initialTeam={parse(results[7])}
      />
    </div>
  );
}

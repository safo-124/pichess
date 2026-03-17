import { getSiteContent } from "@/lib/actions/admin";
import LearningToolsContentEditor from "@/components/admin/LearningToolsContentEditor";
import type {
  LearningToolsHero, LearningTool, LearningTip, LearningToolsCTA, LearningToolsShowcase,
} from "@/lib/learning-tools-content";

export const metadata = { title: "Learning Tools | Admin" };

export default async function AdminLearningToolsPage() {
  const keys = ["learning_hero", "learning_tools", "learning_tips", "learning_cta", "learning_showcase"];
  const results = await Promise.all(keys.map((k) => getSiteContent(k)));

  const parse = <T,>(raw: string | null): T | undefined => {
    if (!raw) return undefined;
    try { return JSON.parse(raw) as T; } catch { return undefined; }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Learning Tools</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Manage the hero, tool cards, chess tips, and call-to-action on the Learning Tools page.
        </p>
      </div>

      <LearningToolsContentEditor
        initialHero={parse<LearningToolsHero>(results[0])}
        initialTools={parse<LearningTool[]>(results[1])}
        initialTips={parse<LearningTip[]>(results[2])}
        initialCTA={parse<LearningToolsCTA>(results[3])}
        initialShowcase={parse<LearningToolsShowcase>(results[4])}
      />
    </div>
  );
}

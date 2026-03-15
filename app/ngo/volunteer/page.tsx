import VolunteerPage from "@/components/ngo/NGOVolunteerPage";
import { getSiteContent } from "@/lib/actions/admin";
import { defaultNGOVolunteer, type NGOVolunteerContent } from "@/lib/ngo-content";

export const metadata = {
  title: "Volunteer | PiChess Foundation",
  description:
    "Share your passion, skills, and time to help us bring chess to more children across Ghana.",
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function VolunteerPageWrapper() {
  const raw = await getSiteContent("ngo_volunteer");
  const content = parse<NGOVolunteerContent>(raw, defaultNGOVolunteer);
  return <VolunteerPage content={content} />;
}

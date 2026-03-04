import { Metadata } from "next";
import NGOMissionPage from "@/components/ngo/NGOMissionPage";

export const metadata: Metadata = {
  title: "Our Mission | PiChess Foundation",
  description:
    "Empowering youth through chess — free equipment, school programs, scholarships, and mentorship across Ghana.",
};

export default function MissionPage() {
  return <NGOMissionPage />;
}

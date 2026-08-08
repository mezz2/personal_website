import type { Metadata } from "next";
import LandingPage from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: {
    absolute: "Riley Meredith",
  },
  description:
    "A young 20-something navigating AI, personal finance, and entrepreneurship.",
};

export default function Home() {
  return <LandingPage />;
}

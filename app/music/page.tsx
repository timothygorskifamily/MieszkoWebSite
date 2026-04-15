import type { Metadata } from "next";
import { MusicLibraryPage } from "@/components/music-library-page";

export const metadata: Metadata = {
  title: "The Music of Mieszko Gorski",
  description: "A dedicated listening page showcasing the compositions of Mieszko Gorski.",
};

export default function MusicPage() {
  return <MusicLibraryPage />;
}
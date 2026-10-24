import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rick & Morty Portal - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

interface LayoutProps {
  children: ReactNode;
}

export default function RickAndMortyLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/rickandmorty" className="text-2xl font-black text-lime-400 tracking-wider hover:text-lime-300 transition-colors">
            ✨ PORTAL RICK AND MORTY
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}

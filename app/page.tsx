import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Path from "@/components/Path";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Path />
      <Contact />
    </main>
  );
}

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}


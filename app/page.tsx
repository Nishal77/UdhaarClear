import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Solution from "@/components/landing/Solution";
import ToneEngine from "@/components/landing/ToneEngine";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import GradualBlur from "@/components/ui/GradualBlur";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <GradualBlur
        target="page"
        position="top"
        height="6.5rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        style={{ zIndex: 40 }}
      />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Solution />
        <ToneEngine />
        <Pricing />
        <FAQ />
      </main>
    </div>
  );
}


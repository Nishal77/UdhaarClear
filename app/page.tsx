import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ToolsIntegration from "@/components/landing/ToolsIntegration";
import Comparison from "@/components/landing/Comparison";
import Workflow from "@/components/landing/Workflow";
import Features from "@/components/landing/Features";
import Integrations from "@/components/landing/Integrations";
import Solution from "@/components/landing/Solution";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/landing/ChatWidget";
import CookieConsent from "@/components/landing/CookieConsent";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-landing-system relative">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ToolsIntegration />
        <Comparison />
        <Workflow />
        <Features />
        <Integrations />
        <Solution />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}


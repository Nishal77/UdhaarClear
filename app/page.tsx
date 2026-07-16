import { siteConfig, faqs } from "@/lib/seo";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProofStats from "@/components/landing/SocialProofStats";
import HowItWorks from "@/components/landing/HowItWorks";
import TonalLadder from "@/components/landing/TonalLadder";
import ToolsIntegration from "@/components/landing/ToolsIntegration";
import Comparison from "@/components/landing/Comparison";
import Workflow from "@/components/landing/Workflow";
import Features from "@/components/landing/Features";
import Integrations from "@/components/landing/Integrations";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/landing/ChatWidget";
import CookieConsent from "@/components/landing/CookieConsent";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-main.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    offers: { "@type": "Offer", priceCurrency: "INR", price: "0", description: "Free trial" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-landing-system relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <SocialProofStats />
        <HowItWorks />
        <TonalLadder />
        <Comparison />
        <ToolsIntegration />
        {/* <Workflow /> */}
        <Features />
        {/* <Integrations /> */}
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}


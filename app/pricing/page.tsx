import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Pricing Plans - UdhaarClear",
  description: "Flexible pricing plans for automated debt recovery, ledger reconciliation, and legal Notice sequences. Start free and get paid faster.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-landing-system relative">
      <Navbar />
      <main className="pt-16">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

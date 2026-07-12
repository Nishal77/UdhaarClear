"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Waitlist() {
  const [upvotes, setUpvotes] = useState(32);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Waitlist / Problem Modal States
  const [modalType, setModalType] = useState<"waitlist" | "problem" | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
          setUpvoted(data.upvoted);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  useEffect(() => {
    // Disable overscroll bounce on body and root document element
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  async function handleUpvote() {
    if (upvoted) return;

    // Optimistic UI update
    setUpvotes((n) => n + 1);
    setUpvoted(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setUpvoted(data.upvoted);
        toast.success("Vote recorded! Thanks for helping us shape global payment recovery");
      } else {
        // Rollback on failure
        setUpvotes((n) => n - 1);
        setUpvoted(false);
        toast.error("Failed to submit vote. Please try again.");
      }
    } catch (error) {
      setUpvotes((n) => n - 1);
      setUpvoted(false);
      console.error("Failed to upvote:", error);
      toast.error("An error occurred. Please check your connection.");
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setModalLoading(true);
    try {
      const res = await fetch("/api/wishlist/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalSuccess(true);
        toast.success(data.message || "You're on the list! 🎉");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit waitlist email:", error);
      toast.error("Failed to submit. Please check your connection.");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleProblemSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !message) return;

    setModalLoading(true);
    try {
      const res = await fetch("/api/wishlist/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalSuccess(true);
        toast.success(data.message || "Thank you for sharing your feedback!");
      } else {
        toast.error(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div
      className="h-screen text-black bg-cover bg-center bg-no-repeat relative flex flex-col overflow-hidden overscroll-none touch-none"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/736x/03/01/9f/03019fcffdc6e6d797f95500b6083365.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-black/80 -z-10" />

      {/* Navbar */}
      <nav className="relative z-20 w-full max-w-xl sm:max-w-2xl mx-auto mt-6 flex items-center justify-between p-2 rounded-2xl border border-black/10 backdrop-blur-sm">
        <div className="text-black text-lg font-medium ml-2">UdhaarClear</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalType("problem");
              setModalSuccess(false);
              setEmail("");
              setMessage("");
            }}
            className="px-5 py-2 rounded-xl border border-black/10 text-black hover:bg-black/5 text-sm font-medium transition-colors duration-200 cursor-pointer"
          >
            Tell Us Your Problem
          </button>
          <button
            onClick={() => {
              setModalType("waitlist");
              setModalSuccess(false);
              setEmail("");
            }}
            className="px-6 py-2 rounded-xl bg-[#1F51FF] text-white text-sm font-medium hover:bg-[#1F51FF]/80 transition-colors duration-200 cursor-pointer"
          >
            Join waitlist
          </button>
        </div>
      </nav>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center relative z-10 overflow-auto">
        <h1 className="text-black text-4xl sm:text-6xl font-normal tracking-tight max-w-6xl mt-8">
          How much capital is trapped in your outstanding invoices? If we automated global payment recovery, would it help you grow?
        </h1>

        <p className="text-gray-600 text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
          Help us shape the future of B2B collections. A smart billing platform that schedules automated reminders, instantly reconciles ledger deposits, and offers localized payment options.
        </p>

        <div className="flex flex-row items-center mt-10 gap-4 max-w-md">
          <button
            type="button"
            onClick={handleUpvote}
            disabled={upvoted || loading}
            className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-[#1F51FF] border border-white/10 hover:bg-[#1E293B] transition-colors duration-200 text-sm font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Upvote
          </button>
          <p className="text-sm text-gray-600 text-left leading-snug">
            {upvotes} {" "} businesses want this. &quot;Upvote if you&apos;re tired of wasting hours chasing outstanding invoices.&quot;
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-10 text-xs text-gray-600 relative z-10">
        <p className="text-sm">
          Built with ❤️ for every business that works too hard to not get paid.
        </p>
      </footer>

      {/* Action Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-150 flex flex-col text-left">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setTimeout(() => {
                  setModalSuccess(false);
                  setEmail("");
                  setMessage("");
                }, 200);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {modalSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                {modalType === "waitlist" ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">You're on the list!</h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
                      Thank you for joining. We will notify you as soon as global payment recovery features are ready to test.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed mb-6">
                      We appreciate you sharing your challenges. We'll review your feedback to help direct our product development.
                    </p>
                  </>
                )}
                <button
                  onClick={() => {
                    setModalType(null);
                    setTimeout(() => {
                      setModalSuccess(false);
                      setEmail("");
                      setMessage("");
                    }, 200);
                  }}
                  className="w-full h-11 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13.5px] font-semibold transition-all cursor-pointer"
                >
                  Awesome
                </button>
              </div>
            ) : modalType === "waitlist" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <h3 className="text-[18px] font-medium text-gray-900 mb-1">Join the waitlist</h3>
                  <p className="text-[13px] text-gray-500">Be first to test autonomous cross-border collections.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-black">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-11 rounded-xl border border-gray-200 bg-gray-55 px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#0F172A] focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full h-11 rounded-xl bg-[#1F51FF] hover:bg-[#1F51FF]/80 text-white text-[13.5px] font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleProblemSubmit} className="space-y-4">
                <div>
                  <h3 className="text-[18px] font-medium text-gray-900 mb-1">What challenges are you facing?</h3>
                  <p className="text-[13px] text-gray-600">Tell us what is broken in your accounts receivable flow.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-black">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-11 rounded-xl border border-gray-200 bg-gray-55 px-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#0F172A] focus:outline-none focus:ring-black/5"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-black">Describe the problem</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. It takes us hours to manually follow up with clients on overdue payments, and manual wire matching is error-prone..."
                    className="rounded-xl border border-gray-200 bg-gray-55 p-4 text-[13.5px] text-gray-900 placeholder-gray-400 focus:border-[#0F172A] focus:outline-none focus:ring-black/5 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full h-11 rounded-xl bg-[#1F51FF] hover:bg-[#1F51FF]/80 text-white text-[13.5px] font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? "Submitting..." : "Submit Problem"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

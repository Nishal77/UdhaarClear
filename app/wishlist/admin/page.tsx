"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StatItem {
  baselineVotes: number;
  dbVotes: number;
  totalVotes: number;
  totalEmails: number;
  totalFeedbacks: number;
}

interface WaitlistEmail {
  id: string;
  email: string;
  createdAt: string;
}

interface WishlistFeedback {
  id: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function WishlistAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState<StatItem | null>(null);
  const [emails, setEmails] = useState<WaitlistEmail[]>([]);
  const [feedbacks, setFeedbacks] = useState<WishlistFeedback[]>([]);
  const [activeTab, setActiveTab] = useState<"emails" | "feedbacks">("emails");
  const [searchQuery, setSearchQuery] = useState("");

  // Load credentials from sessionStorage on mount if already logged in
  useEffect(() => {
    const savedUser = sessionStorage.getItem("wishlist_admin_user");
    const savedPass = sessionStorage.getItem("wishlist_admin_pass");
    if (savedUser && savedPass) {
      handleLogin(savedUser, savedPass);
    }
  }, []);

  async function handleLogin(user = username, pass = password) {
    if (!user || !pass) return;
    setLoading(true);

    try {
      const token = btoa(`${user}:${pass}`);
      const res = await fetch("/api/wishlist/admin", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setEmails(data.emails);
        setFeedbacks(data.feedbacks || []);
        setAuthenticated(true);
        sessionStorage.setItem("wishlist_admin_user", user);
        sessionStorage.setItem("wishlist_admin_pass", pass);
      } else {
        toast.error("Invalid credentials or unauthorized access.");
        sessionStorage.removeItem("wishlist_admin_user");
        sessionStorage.removeItem("wishlist_admin_pass");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("wishlist_admin_user");
    sessionStorage.removeItem("wishlist_admin_pass");
    setUsername("");
    setPassword("");
    setAuthenticated(false);
    setStats(null);
    setEmails([]);
    setFeedbacks([]);
    toast.success("Logged out successfully.");
  }

  // Filter emails based on search query
  const filteredEmails = emails.filter((item) =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter feedbacks based on search query (email or message content)
  const filteredFeedbacks = feedbacks.filter(
    (item) =>
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy comma-separated emails to clipboard
  function handleCopyEmails() {
    if (emails.length === 0) return;
    const emailListStr = emails.map((item) => item.email).join(", ");
    navigator.clipboard.writeText(emailListStr);
    toast.success("All emails copied to clipboard!");
  }

  // Export to CSV
  function handleExportCSV() {
    if (emails.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Email,Date Joined\n" +
      emails.map((item) => `"${item.id}","${item.email}","${new Date(item.createdAt).toLocaleString()}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wishlist_signups_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#FF6A39] flex items-center justify-center mb-2">
              <span className="text-white text-[16px] font-bold">U</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-outfit">Wishlist Admin Portal</h2>
            <p className="text-[12.5px] text-gray-400 mt-1">Authenticate to access waitlist analytics</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4.5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-700">Username</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[13.5px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-gray-700">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 block w-full rounded-xl border border-gray-200 bg-white px-4 text-[13.5px] text-gray-900 focus:border-[#FF6A39] focus:outline-none focus:ring-2 focus:ring-[#FF6A39]/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-[13.5px] font-semibold transition-all disabled:opacity-40 cursor-pointer mt-2"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-6 sm:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Dashboard Nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 font-outfit">Wishlist Dashboard</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Real-time upvotes counter & waitlist register</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-red-50 hover:text-rose-600 hover:border-rose-200 text-gray-600 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 text-left">
            <span className="text-[20px]" role="img" aria-label="Upvotes">🗳️</span>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3">Total Upvotes</p>
            <h3 className="text-3xl font-bold text-gray-950 mt-1 font-outfit">
              {stats?.totalVotes ?? 32}
            </h3>
            <p className="text-[11.5px] text-gray-400 mt-2">
              {stats?.baselineVotes ?? 32} baseline + {stats?.dbVotes ?? 0} database votes
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[20px] p-6 text-left">
            <span className="text-[20px]" role="img" aria-label="Emails">📧</span>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3">Waitlist Signups</p>
            <h3 className="text-3xl font-bold text-gray-950 mt-1 font-outfit">
              {stats?.totalEmails ?? 0}
            </h3>
            <p className="text-[11.5px] text-gray-400 mt-2">Unique email waitlist signups</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[20px] p-6 text-left">
            <span className="text-[20px]" role="img" aria-label="Problems">⚠️</span>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3">Business Problems</p>
            <h3 className="text-3xl font-bold text-gray-950 mt-1 font-outfit">
              {stats?.totalFeedbacks ?? 0}
            </h3>
            <p className="text-[11.5px] text-gray-400 mt-2">Customer pain points shared</p>
          </div>
        </div>

        {/* Main Content Dashboard Card */}
        <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden flex flex-col">
          {/* Sub Header & Tabs */}
          <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex border-b border-gray-100 sm:border-0 pb-2 sm:pb-0 gap-6">
                <button
                  onClick={() => {
                    setActiveTab("emails");
                    setSearchQuery("");
                  }}
                  className={`text-sm font-bold pb-2 cursor-pointer transition-colors relative ${
                    activeTab === "emails" ? "text-gray-950" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Waitlist Directory ({emails.length})
                  {activeTab === "emails" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("feedbacks");
                    setSearchQuery("");
                  }}
                  className={`text-sm font-bold pb-2 cursor-pointer transition-colors relative ${
                    activeTab === "feedbacks" ? "text-gray-950" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Business Problems ({feedbacks.length})
                  {activeTab === "feedbacks" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab === "emails" ? "email" : "content"}...`}
                  className="h-9 w-48 rounded-lg border border-gray-200 bg-gray-50 px-3 text-[12.5px] text-gray-900 placeholder-gray-400 focus:border-gray-950 focus:outline-none"
                />
                {activeTab === "emails" && (
                  <>
                    <button
                      onClick={handleCopyEmails}
                      disabled={emails.length === 0}
                      className="h-9 px-4 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold hover:bg-gray-200 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Copy All
                    </button>
                    <button
                      onClick={handleExportCSV}
                      disabled={emails.length === 0}
                      className="h-9 px-4 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Export CSV
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Directory Listings */}
          <div className="overflow-x-auto">
            {activeTab === "emails" ? (
              filteredEmails.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No email signups found.
                </div>
              ) : (
                <table className="w-full text-left text-[13px] text-gray-600">
                  <thead className="bg-[#FAF9F6] text-gray-400 text-xs uppercase font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">#</th>
                      <th className="px-6 py-3.5">Email Address</th>
                      <th className="px-6 py-3.5">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEmails.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-gray-400 text-xs">{index + 1}</td>
                        <td className="px-6 py-3.5 font-medium text-gray-900">{item.email}</td>
                        <td className="px-6 py-3.5 text-gray-400">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              filteredFeedbacks.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No business problems submitted yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredFeedbacks.map((item, index) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col text-left">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400 text-xs">#{index + 1}</span>
                          <span className="font-semibold text-gray-900 text-sm">{item.email}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-[13.5px] text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

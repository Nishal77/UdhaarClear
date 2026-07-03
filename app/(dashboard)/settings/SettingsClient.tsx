"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  Building2,
  Zap,
  Wallet,
  Bell,
  BarChart3,
} from "lucide-react";
import ProfileSection from "@/components/settings/ProfileSection";
import CompanySection from "@/components/settings/CompanySection";
import AutopilotSection from "@/components/settings/AutopilotSection";
import PaymentsSection from "@/components/settings/PaymentsSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import BillingSection from "@/components/settings/BillingSection";

interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string | Date;
}

interface SessionInfo {
  device: string;
  browser: string;
  ip: string;
  location: string;
  isp: string;
  isVpn: boolean;
}

interface UsageSummary {
  customerCount: number;
  customerLimit: number;
  invoiceCount: number;
  invoiceLimit: number;
}

interface SettingsClientProps {
  dbUser: DbUser;
  businessName: string;
  planTier: string;
  usage: UsageSummary;
  userRole: "Owner" | "CA Auditor" | "Accounts Executive";
  currentSession: SessionInfo;
  initialAvatarUrl: string;
  identities: any[];
  initialTab?: string;
  updateAction: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
}

const TABS = [
  { id: "profile",       label: "My Profile",         icon: UserIcon,  description: "Personal info & security"    },
  { id: "company",       label: "My Business",         icon: Building2, description: "Logo, GST & legal docs"      },
  { id: "reminders",     label: "Reminder Rules",      icon: Zap,       description: "Auto-send schedule & tone"   },
  { id: "payments",      label: "Payment Collection",  icon: Wallet,    description: "UPI, bank & pay settings"    },
  { id: "notifications", label: "Notifications",       icon: Bell,      description: "When & how we alert you"     },
  { id: "billing",       label: "Plan & Billing",      icon: BarChart3, description: "Usage, plan & receipts"      },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_ALIAS: Record<string, TabId> = {
  autopilot: "reminders",
  sync: "notifications",
  "profile-security": "profile",
  "company-gst": "company",
  "payment-gateway": "payments",
  "billing-limits": "billing",
};

function resolveTab(raw: string | undefined): TabId {
  if (!raw) return "profile";
  if (TAB_ALIAS[raw]) return TAB_ALIAS[raw];
  const valid = TABS.map((t) => t.id) as string[];
  return valid.includes(raw) ? (raw as TabId) : "profile";
}

export default function SettingsClient({
  dbUser,
  businessName,
  planTier,
  usage,
  userRole,
  currentSession,
  initialAvatarUrl,
  identities,
  initialTab,
  updateAction,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>(resolveTab(initialTab));

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* ── Horizontal tab bar ── */}
      <div className="overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 bg-white border border-[#EBEAE6]/70 rounded-2xl p-1.5 w-max min-w-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer whitespace-nowrap group ${
                  active
                    ? "bg-[#FF6B00] shadow-[0_2px_8px_rgba(255,107,0,0.25)] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span
                  className={`text-[12.5px] font-semibold transition-colors ${
                    active ? "text-white" : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Content ── */}
      <div className="w-full">
        {activeTab === "profile" && (
          <ProfileSection
            dbUser={dbUser}
            businessName={businessName}
            planTier={planTier}
            userRole={userRole}
            currentSession={currentSession}
            initialAvatarUrl={initialAvatarUrl}
            identities={identities}
            updateAction={updateAction}
          />
        )}

        {activeTab === "company" && (
          <CompanySection businessName={businessName} />
        )}

        {activeTab === "reminders" && <AutopilotSection />}

        {activeTab === "payments" && <PaymentsSection />}

        {activeTab === "notifications" && <NotificationsSection />}

        {activeTab === "billing" && (
          <BillingSection businessName={businessName} currentPlanTier={planTier} usage={usage} />
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  User as UserIcon, 
  Building,
  Sliders,
  CreditCard,
  Webhook,
  Activity
} from "lucide-react";
import ProfileSection from "@/components/settings/ProfileSection";
import CompanySection from "@/components/settings/CompanySection";
import AutopilotSection from "@/components/settings/AutopilotSection";
import PaymentsSection from "@/components/settings/PaymentsSection";
import SyncSection from "@/components/settings/SyncSection";
import BillingSection from "@/components/settings/BillingSection";

interface UserProps {
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
  iphoneLocation: string;
  iphoneIp: string;
  iphoneIsp: string;
  windowsLocation: string;
  windowsIp: string;
  windowsIsp: string;
}

interface SettingsClientProps {
  dbUser: UserProps;
  businessName: string;
  userRole: "Owner" | "CA Auditor" | "Accounts Executive";
  currentSession: SessionInfo;
  initialAvatarUrl: string;
  identities: any[];
  initialTab?: string;
  updateAction: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
}

export default function SettingsClient({
  dbUser,
  businessName,
  userRole,
  currentSession,
  initialAvatarUrl,
  identities,
  initialTab = "profile",
  updateAction
}: SettingsClientProps) {
  // Outer Active Tab state
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab change to URL query parameter
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabId);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* TOP TABS NAVIGATION: Unified 6-Tab horizontal selector */}
      <div className="w-full flex items-center gap-1 rounded-[18px] bg-gray-200/50 p-1 select-none overflow-x-auto scrollbar-none shrink-0 mb-2">
        <button
          type="button"
          onClick={() => handleTabChange("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <UserIcon className={`w-3.5 h-3.5 ${activeTab === "profile" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Profile & Security</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("company")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "company"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <Building className={`w-3.5 h-3.5 ${activeTab === "company" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Company Profile & GST</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("autopilot")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "autopilot"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <Sliders className={`w-3.5 h-3.5 ${activeTab === "autopilot" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Collection Autopilot</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("payments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "payments"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <CreditCard className={`w-3.5 h-3.5 ${activeTab === "payments" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Payment Gateway</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("sync")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "sync"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <Webhook className={`w-3.5 h-3.5 ${activeTab === "sync" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Accounting & ERP Sync</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("billing")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold rounded-xl transition-all border whitespace-nowrap cursor-pointer ${
            activeTab === "billing"
              ? "bg-white text-gray-900 border-gray-200/60 shadow-3xs"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${activeTab === "billing" ? "text-[#FF6B00]" : "text-gray-400"}`} />
          <span>Billing, Limits & Usage</span>
        </button>
      </div>

      {/* CONTENT WORKSPACE: Renders the active tab parameters dynamically */}
      <div className="w-full min-h-[500px]">
        {activeTab === "profile" && (
          <ProfileSection
            dbUser={dbUser}
            businessName={businessName}
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

        {activeTab === "autopilot" && (
          <AutopilotSection />
        )}

        {activeTab === "payments" && (
          <PaymentsSection />
        )}

        {activeTab === "sync" && (
          <SyncSection />
        )}

        {activeTab === "billing" && (
          <BillingSection businessName={businessName} />
        )}
      </div>
    </div>
  );
}

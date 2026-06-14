"use client";

import React, { useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface NotificationRow {
  id: string;
  title: string;
  description: string;
  email: boolean;
  whatsapp: boolean;
  emailLocked?: boolean;
  whatsappLocked?: boolean;
  whatsappLockedLabel?: string;
}

const DEFAULT_ROWS: NotificationRow[] = [
  {
    id: "payment_received",
    title: "Payment received",
    description: "When a customer pays any invoice via Razorpay or submits bank transfer proof",
    email: true,
    whatsapp: true,
  },
  {
    id: "invoice_overdue",
    title: "Invoice crossed due date",
    description: "When an invoice passes its due date and enters overdue status",
    email: true,
    whatsapp: false,
  },
  {
    id: "utr_submitted",
    title: "Payment proof submitted",
    description: "When a customer self-reports a bank transfer (UTR pending your approval)",
    email: true,
    whatsapp: true,
  },
  {
    id: "customer_replied",
    title: "Customer replied on WhatsApp",
    description: "When a debtor replies to a reminder — auto-pause kicks in until you respond",
    email: true,
    whatsapp: false,
    whatsappLocked: true,
    whatsappLockedLabel: "Via inbox",
  },
  {
    id: "reminders_paused",
    title: "Reminders auto-paused",
    description: "When the system stops sending after 42 days with no payment response",
    email: true,
    whatsapp: false,
  },
  {
    id: "weekly_summary",
    title: "Weekly collection summary",
    description: "Every Monday — total collected, outstanding AR, and top defaulters",
    email: true,
    whatsapp: false,
  },
  {
    id: "plan_limit_warning",
    title: "Plan usage warning",
    description: "When you reach 80% of your customer or invoice plan limit",
    email: true,
    whatsapp: false,
    emailLocked: true,
  },
];

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`relative inline-flex items-center select-none ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B00]" />
    </label>
  );
}

function LockedBadge({ label }: { label: string }) {
  return (
    <span className="text-[10.5px] font-medium tracking-tight text-gray-400 bg-gray-100 border border-gray-200/60 px-2 py-1 rounded-full whitespace-nowrap">
      {label}
    </span>
  );
}

export default function NotificationsSection() {
  const [rows, setRows] = useState<NotificationRow[]>(DEFAULT_ROWS);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string, channel: "email" | "whatsapp") => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (channel === "email" && row.emailLocked) return row;
        if (channel === "whatsapp" && row.whatsappLocked) return row;
        return { ...row, [channel]: !row[channel] };
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST /api/businesses/notification-preferences
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Notification preferences saved");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        {/* Header */}
        <div className="flex items-center gap-3.5 p-5 border-b border-gray-50">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/30 text-black flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 font-outfit">Notification Preferences</h2>
            <p className="text-xs text-gray-400 font-medium">
              Control when and how UdhaarClear alerts you about activity on your account.
            </p>
          </div>
        </div>

        {/* Channel column headers */}
        <div className="grid grid-cols-[1fr_80px_80px] px-5 py-3 bg-gray-50/60 ">
          <div />
          <div className="flex flex-col items-center justify-end h-10 gap-1 select-none">
            <svg width="22" height="18" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <g clipPath="url(#clip0_4083_2397)">
                <path d="M2.09569 24.0921H6.99003V12.2058L-0.00195312 6.96179V21.9946C-0.00195312 23.1535 0.936728 24.0922 2.09569 24.0922V24.0921Z" fill="#4285F4"/>
                <path d="M23.7754 24.0923H28.6698C29.8287 24.0923 30.7674 23.1537 30.7674 21.9948V6.96204L23.7754 12.206V24.0923Z" fill="#34A853"/>
                <path d="M23.7754 3.11628V12.2058L30.7674 6.96186V4.1651C30.7674 1.57282 27.8081 0.0922772 25.7331 1.64799L23.7754 3.11628Z" fill="#FBBC04"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.99219 12.206V3.11639L15.3825 9.4092L23.7728 3.11639V12.206L15.3825 18.4987L6.99219 12.206Z" fill="#EA4335"/>
                <path d="M-0.00195312 4.16504V6.9618L6.99003 12.2058V3.11622L5.03227 1.64793C2.95734 0.0922189 -0.00195312 1.57277 -0.00195312 4.16492V4.16504Z" fill="#C5221F"/>
              </g>
              <defs>
                <clipPath id="clip0_4083_2397">
                  <rect width="30.7646" height="24" fill="white" transform="translate(-0.00390625 0.0921631)"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-[11.5px] font-medium text-gray-400 tracking-tight">Email</span>
          </div>
          <div className="flex flex-col items-center justify-end h-10 gap-1 select-none">
            <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <g clipPath="url(#clip0_4083_2339)">
                <path d="M7.08822 20.6472L7.47602 20.8411C9.09208 21.8107 10.9019 22.2632 12.7118 22.2632C18.4 22.2632 23.054 17.6092 23.054 11.921C23.054 9.20622 21.9551 6.55603 20.016 4.61685C18.0768 2.67767 15.4912 1.57886 12.7118 1.57886C7.02363 1.57886 2.36958 6.23282 2.43426 11.9857C2.43426 13.9248 3.01601 15.7994 3.98555 17.4152L4.24408 17.8031L3.20995 21.6168L7.08822 20.6472Z" fill="#00E676"/>
                <path d="M21.1149 3.58263C18.9171 1.32033 15.8791 0.0921631 12.7765 0.0921631C6.18343 0.0921631 0.883039 5.45714 0.947626 11.9856C0.947626 14.054 1.52937 16.0579 2.49901 17.8677L0.818359 24.0084L7.08829 22.3924C8.83353 23.3621 10.7726 23.8145 12.7119 23.8145C19.2404 23.8145 24.5407 18.4495 24.5407 11.9211C24.5407 8.75375 23.3125 5.78035 21.1149 3.58263ZM12.7765 21.8108C11.0312 21.8108 9.28601 21.3584 7.7993 20.4534L7.4115 20.2595L3.6625 21.229L4.63204 17.5447L4.37351 17.1568C1.52937 12.5675 2.88681 6.49136 7.54077 3.64722C12.1947 0.803175 18.2061 2.16061 21.0503 6.81457C23.8943 11.4685 22.5369 17.4799 17.883 20.3241C16.3962 21.2936 14.5864 21.8107 12.7765 21.8107V21.8108ZM18.4647 14.636L17.7537 14.3128C17.7537 14.3128 16.7195 13.8603 16.0731 13.5371C16.0084 13.5371 15.9438 13.4724 15.8791 13.4724C15.6852 13.4724 15.5559 13.5371 15.4267 13.6018C15.4267 13.6018 15.3621 13.6663 14.4571 14.7006C14.3924 14.8298 14.2632 14.8945 14.1339 14.8945H14.0692C14.0046 14.8945 13.8754 14.8298 13.8107 14.7652L13.4875 14.636C12.7765 14.3128 12.1301 13.9249 11.613 13.4078C11.4837 13.2785 11.2898 13.1493 11.1605 13.02C10.708 12.5675 10.2555 12.0504 9.93243 11.4686L9.86775 11.3394C9.80316 11.2747 9.80316 11.2101 9.73848 11.0808C9.73848 10.9516 9.73848 10.8223 9.80316 10.7576C9.80316 10.7576 10.0617 10.4344 10.2555 10.2405C10.3849 10.1112 10.4495 9.91734 10.5788 9.78807C10.708 9.59412 10.7727 9.33559 10.708 9.14165C10.6434 8.81843 9.86775 7.0732 9.6739 6.6854C9.54454 6.49145 9.41536 6.42687 9.22142 6.36219H8.51041C8.38105 6.36219 8.25187 6.42687 8.12251 6.42687L8.05783 6.49145C7.92857 6.55613 7.7993 6.6854 7.67004 6.74999C7.54077 6.87934 7.47609 7.00852 7.34682 7.13788C6.89434 7.71962 6.63581 8.43063 6.63581 9.14165C6.63581 9.65871 6.76508 10.1759 6.95902 10.6283L7.0237 10.8223C7.60545 12.0504 8.38105 13.1493 9.41536 14.1188L9.6739 14.3774C9.86775 14.5713 10.0617 14.7006 10.191 14.8944C11.5484 16.058 13.0997 16.8983 14.8449 17.3508C15.0389 17.4153 15.2974 17.4153 15.4913 17.48H16.1377C16.4609 17.48 16.8487 17.3508 17.1073 17.2215C17.3012 17.0922 17.4304 17.0922 17.5597 16.963L17.6891 16.8336C17.8183 16.7043 17.9476 16.6397 18.0769 16.5105C18.2061 16.3812 18.3354 16.2519 18.4001 16.1226C18.5293 15.8641 18.5939 15.5408 18.6586 15.2177V14.7652C18.6586 14.7652 18.5939 14.7006 18.4647 14.636Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_4083_2339">
                  <rect width="23.722" height="24" fill="white" transform="translate(0.818359 0.0921631)"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-[11.5px] font-medium text-gray-400 tracking-tight">WhatsApp</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_80px_80px] items-center px-5 py-4 hover:bg-gray-50/40 transition-colors"
            >
              <div className="pr-4">
                <p className="text-[14.5px] font-medium tracking-tight text-gray-900">{row.title}</p>
                <p className="text-[11.5px] text-gray-400 font-medium mt-0.5 leading-snug">{row.description}</p>
              </div>

              <div className="flex justify-center">
                {row.emailLocked ? (
                  <LockedBadge label="Always on" />
                ) : (
                  <Toggle
                    checked={row.email}
                    onChange={() => toggle(row.id, "email")}
                  />
                )}
              </div>

              <div className="flex justify-center">
                {row.whatsappLocked ? (
                  <LockedBadge label={row.whatsappLockedLabel ?? "N/A"} />
                ) : (
                  <Toggle
                    checked={row.whatsapp}
                    onChange={() => toggle(row.id, "whatsapp")}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer save */}
        <div className="px-5 py-4 border-t border-gray-50 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* WhatsApp info note */}
      <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-100 rounded-[16px] p-4">
        <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-amber-800 leading-relaxed">
          WhatsApp alerts <span className="font-bold">to you</span> (not your customers) require your mobile number
          in <span className="font-bold">My Profile</span> and a connected WABA account in{" "}
          <span className="font-bold">Payment Collection</span>. Email alerts work immediately.
        </p>
      </div>
    </div>
  );
}

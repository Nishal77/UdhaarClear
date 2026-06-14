"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  User as UserIcon,
  Laptop,
  Smartphone,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Upload,
  X,
  Loader2,
  LogOut,
} from "lucide-react";

function getDeviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes("iphone") || d.includes("android") || d.includes("phone") || d.includes("mobile")) {
    return <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />;
  }
  return <Laptop className="w-4 h-4 text-slate-500 shrink-0" />;
}

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

interface ProfileSectionProps {
  dbUser: DbUser;
  businessName: string;
  planTier: string;
  userRole: "Owner" | "CA Auditor" | "Accounts Executive";
  currentSession: SessionInfo;
  initialAvatarUrl: string;
  identities: any[];
  updateAction: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
}

function getPlanDisplayName(tier: string) {
  switch (tier?.toUpperCase()) {
    case "STARTER": return "Starter Plan";
    case "GROWTH":  return "Growth Plan";
    case "CA_PRO":  return "CA Pro Plan";
    default:        return "Free Plan";
  }
}

export default function ProfileSection({
  dbUser,
  businessName,
  planTier,
  userRole,
  currentSession,
  initialAvatarUrl,
  identities,
  updateAction,
}: ProfileSectionProps) {
  const router = useRouter();
  const supabase = createClient();

  const joinedDate = dbUser.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  const [name, setName] = useState(dbUser.name);
  const [phone, setPhone] = useState(dbUser.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(identities.some((i) => i.provider === "google"));
  const [isLinking, setIsLinking] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);

  // Crop modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasChanges(name !== dbUser.name || phone !== (dbUser.phone || ""));
  }, [name, phone, dbUser]);

  const isNameFilled = name.trim() !== "";
  const isPhoneFilled = phone.trim() !== "";
  const isAvatarUploaded = avatarUrl !== "" && !avatarUrl.startsWith("/profile/img");
  let completionPoints = 25;
  if (isNameFilled) completionPoints += 25;
  if (isPhoneFilled) completionPoints += 25;
  if (isAvatarUploaded) completionPoints += 25;

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateAction(name, phone);
      if (res.success) {
        toast.success("Personal details saved");
        setHasChanges(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update details");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleLink = async () => {
    setIsLinking(true);
    try {
      if (isGoogleLinked) {
        // Disconnect: unlink identity
        const { error } = await supabase.auth.unlinkIdentity(
          identities.find((i) => i.provider === "google")
        );
        if (error) throw error;
        setIsGoogleLinked(false);
        toast.success("Google account disconnected");
      } else {
        // Connect: OAuth redirect
        const { error } = await supabase.auth.linkIdentity({ provider: "google" });
        if (error) throw error;
        // Browser redirects — nothing to do here
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update Google link");
    } finally {
      setIsLinking(false);
    }
  };

  const handleSignOutAll = async () => {
    const ok = window.confirm("This will sign you out on ALL devices, including this one. Continue?");
    if (!ok) return;
    setIsSigningOutAll(true);
    try {
      await supabase.auth.signOut({ scope: "global" });
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out all sessions");
      setIsSigningOutAll(false);
    }
  };

  const handleSignOutCurrent = async () => {
    const ok = window.confirm("Sign out of this device?");
    if (!ok) return;
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setDragOffset({ x: 0, y: 0 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const applyCrop = () => {
    if (!imageSrc) return;
    setIsUploading(true);
    setCropModalOpen(false);

    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 160;
      canvas.width = size;
      canvas.height = size;

      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const scale = (size / minDim) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (size - dw) / 2 + dragOffset.x;
      const dy = (size - dh) / 2 + dragOffset.y;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);

      const b64 = canvas.toDataURL("image/jpeg", 0.85);

      try {
        const { error } = await supabase.auth.updateUser({ data: { avatar_url: b64 } });
        if (error) throw error;
        setAvatarUrl(b64);
        toast.success("Profile photo updated");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to save photo");
      } finally {
        setIsUploading(false);
        setImageSrc(null);
      }
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5 w-full animate-in fade-in duration-200">
      {/* ── Left: form + sessions ── */}
      <div className="lg:col-span-2 space-y-4.5">

        {/* Personal info */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 font-outfit">Personal Information</h2>
              <p className="text-xs text-gray-400 font-medium">Your name and phone are shown on PDF invoices and WhatsApp templates.</p>
            </div>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Nishal Poojary"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Email (read-only)</label>
                <input
                  type="email"
                  disabled
                  value={dbUser.email}
                  className="w-full bg-gray-100 border border-gray-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">Business (read-only)</label>
                <input
                  type="text"
                  disabled
                  value={businessName}
                  className="w-full bg-gray-100 border border-gray-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!hasChanges || isSaving}
                className={`text-xs font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer ${
                  hasChanges && !isSaving
                    ? "bg-[#FF6B00] hover:bg-[#E05B2E] text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : "Save Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Linked accounts */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 font-outfit">Linked Accounts</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Connect Google for 1-click sign-in alongside your email/OTP login.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/20 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 font-outfit">Google Account</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGoogleLinked ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <span className="text-[11px] font-semibold text-gray-400">
                    {isGoogleLinked ? "Connected" : "Not linked"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLink}
              disabled={isLinking}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
                isGoogleLinked
                  ? "border-gray-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isLinking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isGoogleLinked ? "Disconnect" : "Connect Account"}
            </button>
          </div>
        </div>

        {/* Session security */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 font-outfit">Current Session</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Your active login. Sign out here or on all devices at once.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50/40 flex items-start gap-3">
              {getDeviceIcon(currentSession.device)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12.5px] font-semibold text-gray-900">
                    {currentSession.device} / {currentSession.browser}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Active now
                  </span>
                  {currentSession.isVpn && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      VPN
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-gray-500 font-medium">{currentSession.ip || "—"}</span>
                  {currentSession.location && (
                    <span className="text-[11px] text-gray-400 font-medium">{currentSession.location}</span>
                  )}
                  {currentSession.isp && (
                    <span className="text-[11px] text-gray-400 font-medium">{currentSession.isp}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOutCurrent}
                className="text-[10.5px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/70">
            <div>
              <p className="text-[12.5px] font-bold text-rose-800">Sign out everywhere</p>
              <p className="text-[10.5px] text-rose-600/80 font-medium mt-0.5">
                Revokes all active sessions — browser, mobile, and API tokens.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOutAll}
              disabled={isSigningOutAll}
              className="flex items-center gap-1.5 text-[10.5px] font-bold px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isSigningOutAll ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <LogOut className="w-3 h-3" />
              )}
              All Devices
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: avatar card ── */}
      <div className="space-y-4.5">
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 relative text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 mx-auto mb-4 group select-none cursor-pointer rounded-full"
            title="Change Photo"
          >
            <div className="w-full h-full rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group-hover:brightness-90 transition-all">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <img src={avatarUrl || "/profile/img1.jpeg"} alt="Avatar" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="w-5 h-5 text-white" />
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <h3 className="text-base font-semibold text-gray-900 font-outfit">{name || "Your Name"}</h3>
          <p className="text-xs text-gray-400 font-medium">{dbUser.email}</p>

          <div className="mt-2.5 flex items-center justify-center gap-2 select-none">
            <span className="text-[11.5px] font-medium text-gray-500">{userRole}</span>
            <span className="text-gray-300">•</span>
            <span className="text-[11.5px] font-medium text-gray-500">{getPlanDisplayName(planTier)}</span>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-50 text-left">
            <div className="flex justify-between items-center text-[12.5px] font-medium text-gray-500 mb-2">
              <span>Profile Completion</span>
              <span className="text-gray-900 font-semibold">{completionPoints}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPoints}%` }}
              />
            </div>
            {completionPoints < 100 && (
              <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100/80 rounded-2xl text-[11px] text-amber-800 font-semibold leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Add a phone number and profile photo to complete your profile.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 text-left flex items-center gap-2 text-xs text-gray-400 font-medium select-none">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Joined: {joinedDate}
          </div>
        </div>
      </div>

      {/* Crop modal */}
      {cropModalOpen && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] p-6 w-full max-w-md text-center mx-4 select-none relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => { setCropModalOpen(false); setImageSrc(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 font-outfit mb-1">Crop Profile Photo</h3>
            <p className="text-xs text-gray-400 font-medium mb-4">Drag inside the circle to position.</p>

            <div
              className="w-64 h-64 mx-auto rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative cursor-move select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                className="max-w-none origin-center transition-transform duration-75 select-none"
                style={{
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`,
                  pointerEvents: "none",
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-[#FF6B00] pointer-events-none" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setCropModalOpen(false); setImageSrc(null); }}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="px-5 py-2 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  Loader2
} from "lucide-react";

// Unique icons for devices
function getDeviceIcon(device: string) {
  const name = device.toLowerCase();
  if (name.includes("iphone") || name.includes("android") || name.includes("phone") || name.includes("mobile")) {
    return <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />;
  }
  return <Laptop className="w-4 h-4 text-slate-500 shrink-0" />;
}

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

interface ProfileSectionProps {
  dbUser: UserProps;
  businessName: string;
  userRole: "Owner" | "CA Auditor" | "Accounts Executive";
  currentSession: SessionInfo;
  initialAvatarUrl: string;
  identities: any[];
  updateAction: (name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
}

export default function ProfileSection({
  dbUser,
  businessName,
  userRole,
  currentSession,
  initialAvatarUrl,
  identities,
  updateAction
}: ProfileSectionProps) {
  const router = useRouter();
  const supabase = createClient();

  const joinedDate = dbUser.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    : "N/A";

  const [name, setName] = useState(dbUser.name);
  const [phone, setPhone] = useState(dbUser.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(identities.some(id => id.provider === "google"));
  const [isLinking, setIsLinking] = useState(false);

  // Crop Modal states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessions, setSessions] = useState([
    {
      id: "current",
      device: `${currentSession.device} / ${currentSession.browser}`,
      rawDevice: currentSession.device,
      location: currentSession.location,
      isp: currentSession.isp,
      ip: currentSession.ip,
      lastActive: "Active now",
      isCurrent: true,
      isVpn: currentSession.isVpn
    },
    {
      id: "iphone",
      device: "iPhone / Safari",
      rawDevice: "iPhone",
      location: currentSession.iphoneLocation,
      isp: currentSession.iphoneIsp,
      ip: currentSession.iphoneIp,
      lastActive: "3 hours ago",
      isCurrent: false,
      isVpn: false
    },
    {
      id: "windows",
      device: "Windows / Edge",
      rawDevice: "Windows",
      location: currentSession.windowsLocation,
      isp: currentSession.windowsIsp,
      ip: currentSession.windowsIp,
      lastActive: "May 29, 2026",
      isCurrent: false,
      isVpn: false
    }
  ]);

  // Track profile changes
  useEffect(() => {
    setHasChanges(name !== dbUser.name || phone !== (dbUser.phone || ""));
  }, [name, phone, dbUser]);

  // Profile completion calculation
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
        toast.success("Personal details saved successfully");
        setHasChanges(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update details");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleLink = async () => {
    setIsLinking(true);
    try {
      if (isGoogleLinked) {
        setIsGoogleLinked(false);
        toast.success("Google single sign-on disconnected (Simulated)");
      } else {
        setIsGoogleLinked(true);
        toast.success("Google single sign-on connected (Simulated)");
      }
    } catch (err: any) {
      toast.error("Failed to link account");
    } finally {
      setIsLinking(false);
    }
  };

  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    if (sessionId === "current") {
      const confirmLogout = window.confirm("Revoking this session will sign you out of your current device. Proceed?");
      if (confirmLogout) {
        supabase.auth.signOut().then(() => {
          window.location.href = "/login";
        });
      }
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: `Revoking login authorization for ${deviceName}...`,
        success: () => {
          setSessions(prev => prev.filter(s => s.id !== sessionId));
          return `Session for device ${deviceName} has been revoked successfully.`;
        },
        error: "Failed to revoke device session."
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB");
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
    setDragOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const minDimension = Math.min(imgWidth, imgHeight);

      const scaleFactor = (size / minDimension) * zoom;
      const drawWidth = imgWidth * scaleFactor;
      const drawHeight = imgHeight * scaleFactor;

      const dx = (size - drawWidth) / 2 + dragOffset.x;
      const dy = (size - drawHeight) / 2 + dragOffset.y;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.85);

      try {
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: croppedBase64 }
        });
        if (error) throw error;

        setAvatarUrl(croppedBase64);
        toast.success("Profile photo updated successfully");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to save profile picture");
      } finally {
        setIsUploading(false);
        setImageSrc(null);
      }
    };
  };

  const renderRoleBadge = () => {
    switch (userRole) {
      case "Owner":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EB] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF6A39] border border-[#FF6A39]/15">
            Owner
          </span>
        );
      case "CA Auditor":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100/60">
            CA Auditor
          </span>
        );
      case "Accounts Executive":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200/80">
            Accounts Executive
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5 w-full animate-in fade-in duration-200">
      {/* Form & Sessions */}
      <div className="lg:col-span-2 space-y-4.5">

        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center ">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 font-outfit">Personal Information</h2>
              <p className="text-xs text-gray-400 font-medium">Manage details about your personal identity logged into UdhaarClear.</p>
            </div>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 tracking-tight mb-1.5 font-outfit">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Nishal P"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all shadow-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 tracking-tight mb-1.5 font-outfit">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={dbUser.email}
                  className="w-full bg-gray-100 border border-gray-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 tracking-tight mb-1.5 font-outfit">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all shadow-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 tracking-tight mb-1.5 font-outfit">
                  Business Name
                </label>
                <input
                  type="text"
                  disabled
                  value={businessName}
                  className="w-full bg-gray-100 border border-gray-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!hasChanges || isSaving}
                className={`text-xs font-semibold px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${hasChanges && !isSaving
                    ? "bg-[#FF6B00] hover:bg-[#E05B2E] text-white shadow-sm hover:shadow"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Personal Details"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Linked Accounts */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 font-outfit">Linked Accounts</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Connect Google OAuth accounts for secure 1-click login.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/20 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                  <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 font-outfit">Google Account</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGoogleLinked ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <span className="text-[11px] font-semibold text-gray-400">{isGoogleLinked ? "Connected" : "Not linked"}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLink}
              disabled={isLinking}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${isGoogleLinked
                  ? "border-gray-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                } active:scale-95`}
            >
              {isLinking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isGoogleLinked ? (
                "Disconnect"
              ) : (
                "Connect Account"
              )}
            </button>
          </div>
        </div>

        {/* Session Auditor */}
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-outfit">Active Security Sessions</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Review login devices currently authenticated on your credentials.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-outfit">Device & Browser</th>
                    <th className="pb-3 font-outfit">Location / ISP</th>
                    <th className="pb-3 font-outfit">IP Address</th>
                    <th className="pb-3 font-outfit">Last Active</th>
                    <th className="pb-3 text-right font-outfit">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 flex items-center gap-2.5 font-outfit text-gray-800">
                        {getDeviceIcon(session.rawDevice)}
                        <div>
                          <p className="font-bold">{session.device}</p>
                          {session.isCurrent && (
                            <span className="inline-flex items-center text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded mt-0.5">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">{session.location}</span>
                          <span className="text-[10px] text-gray-400 font-semibold mt-0.5">{session.isp}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-gray-400">{session.ip}</td>
                      <td className="py-3.5 font-medium text-gray-500">{session.lastActive}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleRevokeSession(session.id, session.rawDevice)}
                          className={`text-[10.5px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${session.isCurrent
                              ? "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                              : "border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-100/80"
                            }`}
                        >
                          {session.isCurrent ? "Sign Out" : "Revoke Session"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Profile Avatar & Completion details card */}
      <div className="space-y-4.5">
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 relative text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 mx-auto mb-4 group select-none cursor-pointer rounded-full"
            title="Change Photo"
          >
            <div className="w-full h-full rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center transition-all group-hover:brightness-90">
              <img src={avatarUrl || "/profile/img1.jpeg"} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <Upload className="w-5 h-5 text-white" />
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <h3 className="text-base font-semibold text-gray-900 font-outfit">{name || "User Name"}</h3>
          <p className="text-xs text-gray-400 font-medium">{dbUser.email}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {renderRoleBadge()}
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-blue-600 border border-blue-100">
              Pro Account
            </span>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-50 text-left">
            <div className="flex justify-between items-center text-[12.5px] font-medium text-gray-500 tracking-tight mb-2">
              <span>Profile Completion</span>
              <span className="text-gray-900 font-semibold">{completionPoints}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${completionPoints}%` }} />
            </div>
            {completionPoints < 100 && (
              <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100/80 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Upload a profile photo or verify details to complete workspace authentication.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 text-left flex items-center gap-2 text-xs text-gray-400 font-medium select-none">
            <Calendar className="w-3.5 h-3.5 text-gray-400" /> Registered: {joinedDate}
          </div>
        </div>
      </div>

      {/* Circular Crop Modal Dialog */}
      {cropModalOpen && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] p-6 w-full max-w-md text-center mx-4 select-none relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setCropModalOpen(false);
                setImageSrc(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 font-outfit mb-1">Crop Profile Photo</h3>
            <p className="text-xs text-gray-400 font-medium mb-4">Drag the image inside the circular crop mask to align.</p>

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
                alt="Image to crop"
                draggable={false}
                className="max-w-none origin-center transition-transform duration-75 select-none"
                style={{
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`,
                  pointerEvents: "none"
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-[#FF6B00] pointer-events-none" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 font-outfit">
                <span>Zoom Scale</span>
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

            <div className="mt-6 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setImageSrc(null);
                }}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="px-5 py-2 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-full shadow-sm hover:shadow active:scale-95 transition-all"
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

"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Building,
  Upload,
  Check,
  Loader2,
  FileText,
  FileSignature,
  ExternalLink,
} from "lucide-react";

interface CompanySectionProps {
  businessName: string;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;

export default function CompanySection({ businessName }: CompanySectionProps) {
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [tradeName, setTradeName] = useState(businessName);
  const [gstin, setGstin] = useState("");
  const [msmeId, setMsmeId] = useState("");
  const [advocateLetterhead, setAdvocateLetterhead] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);

  const [gstStatus, setGstStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");

  const businessLogoInputRef = useRef<HTMLInputElement>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleVerifyGstFormat = () => {
    const raw = gstin.trim().toUpperCase();
    if (!raw) {
      toast.error("Enter a GSTIN first");
      return;
    }
    setGstStatus("checking");
    setTimeout(() => {
      if (GSTIN_REGEX.test(raw)) {
        setGstStatus("valid");
        toast.success("GSTIN format valid ✓ — verify with GST portal for live status");
      } else {
        setGstStatus("invalid");
        toast.error("Invalid GSTIN format — expected pattern: 27AAAAA1111A1Z1");
      }
    }, 600);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setBusinessLogo(reader.result as string);
      setLogoUploading(false);
      toast.success("Logo uploaded");
    };
    reader.readAsDataURL(file);
  };

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdvocateLetterhead(file.name);
    toast.success(`Letterhead "${file.name}" uploaded`);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDigitalSignature(reader.result as string);
      toast.success("Digital signature uploaded");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5 w-full animate-in fade-in duration-200">
      {/* ── Left: inputs ── */}
      <div className="lg:col-span-2 space-y-4.5">

        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">Company Profile & Legalities</h2>
              <p className="text-xs text-gray-400 font-medium">These details appear on legal notices and payment receipts sent to your customers.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* GSTIN */}
            <div className="bg-slate-50/50 border border-gray-200/50 rounded-2xl p-4">
              <div className="flex flex-col md:flex-row items-end gap-3">
                <div className="flex-1 w-full text-left">
                  <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      setGstStatus("idle");
                    }}
                    className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#FF6B00] uppercase"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyGstFormat}
                  disabled={gstStatus === "checking"}
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {gstStatus === "checking" ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking...</>
                  ) : gstStatus === "valid" ? (
                    <><Check className="w-3.5 h-3.5" /> Format Valid</>
                  ) : "Check Format"}
                </button>
              </div>

              {gstStatus === "valid" && (
                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Format looks correct.
                  <a
                    href="https://www.gst.gov.in/taxpayersearch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[#FF6B00] hover:underline"
                  >
                    Verify live on gst.gov.in <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {gstStatus === "invalid" && (
                <p className="mt-2 text-[11px] font-semibold text-rose-600">
                  Format invalid — expected 15 chars like <span className="font-mono">27AAAAA1111A1Z1</span>
                </p>
              )}
            </div>

            {/* Trade name + MSME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Legal Trade Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Pvt Ltd"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  MSME / Udyam Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UDYAM-MH-00-1234567"
                  value={msmeId}
                  onChange={(e) => setMsmeId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal docs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-gray-900 font-outfit">Advocate Letterhead</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-semibold">
              Header applied to automated legal recovery notices sent on Day 28+.
            </p>
            <div
              onClick={() => letterheadInputRef.current?.click()}
              className="border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-center"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              {advocateLetterhead ? (
                <span className="text-xs font-bold text-slate-700 truncate max-w-full">{advocateLetterhead}</span>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-700">Upload PDF or PNG</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Max 2 MB</span>
                </>
              )}
            </div>
            <input type="file" ref={letterheadInputRef} onChange={handleLetterheadUpload} accept="application/pdf,image/*" className="hidden" />
          </div>

          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <FileSignature className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-gray-900 font-outfit">Digital Signature</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-semibold">
              Signee's transparent PNG applied to court notification PDFs.
            </p>
            <div
              onClick={() => signatureInputRef.current?.click()}
              className="border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-center min-h-[90px]"
            >
              {digitalSignature ? (
                <div className="h-12 w-auto overflow-hidden">
                  <img src={digitalSignature} alt="Signature" className="h-full object-contain" />
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Upload Transparent PNG</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">Max 1 MB</span>
                </>
              )}
            </div>
            <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} accept="image/png" className="hidden" />
          </div>
        </div>
      </div>

      {/* ── Right: logo ── */}
      <div className="space-y-4.5">
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-center">
          <h3 className="text-sm font-bold text-gray-900 font-outfit mb-1">Business Logo</h3>
          <p className="text-[10.5px] text-gray-400 font-medium mb-4">Shown on customer-facing payment pages and receipts.</p>

          <div
            onClick={() => businessLogoInputRef.current?.click()}
            className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer min-h-[140px]"
          >
            {logoUploading ? (
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            ) : businessLogo ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-gray-100">
                <img src={businessLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Upload Logo</span>
                <span className="text-[10px] text-gray-400 mt-0.5 font-semibold">PNG, JPG · max 1 MB</span>
              </>
            )}
          </div>
          <input type="file" ref={businessLogoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>Workspace</span>
            <span className="text-[#FF6B00] uppercase font-black font-outfit truncate max-w-[120px]">{businessName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

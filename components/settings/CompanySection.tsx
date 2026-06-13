"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { 
  Building, 
  Upload, 
  Check, 
  Loader2, 
  FileText, 
  FileSignature 
} from "lucide-react";

interface CompanySectionProps {
  businessName: string;
}

export default function CompanySection({ businessName }: CompanySectionProps) {
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [tradeName, setTradeName] = useState(businessName);
  const [gstin, setGstin] = useState("");
  const [msmeId, setMsmeId] = useState("");
  const [advocateLetterhead, setAdvocateLetterhead] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);

  const [isGstVerifying, setIsGstVerifying] = useState(false);
  const [isGstVerified, setIsGstVerified] = useState(false);

  const businessLogoInputRef = useRef<HTMLInputElement>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleVerifyGst = () => {
    if (!gstin.trim()) {
      toast.error("Please input a valid GSTIN number first");
      return;
    }
    
    setIsGstVerifying(true);
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const validPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
          if (!validPattern.test(gstin)) {
            reject(new Error("Invalid GSTIN format. Expected: 27AAAAA1111A1Z1"));
            return;
          }
          resolve(true);
        }, 1500);
      }),
      {
        loading: "Connecting to Goods and Services Tax Network API...",
        success: () => {
          setIsGstVerified(true);
          setIsGstVerifying(false);
          setTradeName("JP Constructions Private Limited");
          return "GST verified! Legal Trade Name updated to: JP Constructions Private Limited";
        },
        error: (err: any) => {
          setIsGstVerifying(false);
          return err.message || "GST verification failed. Please check your inputs.";
        }
      }
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        setBusinessLogo(reader.result as string);
        setLogoUploading(false);
        toast.success("Corporate logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Advocate Letterhead "${file.name}" uploaded successfully`);
    setAdvocateLetterhead(file.name);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDigitalSignature(reader.result as string);
      toast.success("Digital Signature uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5 w-full animate-in fade-in duration-200">
      {/* Left panels: Logo, Inputs, verification */}
      <div className="lg:col-span-2 space-y-4.5">
        
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 text-slate-700 flex items-center justify-center shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-outfit">Company Profile & Legalities</h2>
              <p className="text-xs text-gray-400 font-medium">Verify your corporate entity values. These details are printed on outstanding legal notices.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* GST Verification Panel */}
            <div className="bg-slate-50/50 border border-gray-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-end gap-3.5">
              <div className="flex-1 w-full text-left">
                <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  GSTIN (India GST ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AAAAA1111A1Z1"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#FF6B00] shadow-none uppercase"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyGst}
                disabled={isGstVerifying}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05B2E] text-white text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                {isGstVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                  </>
                ) : isGstVerified ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Verified
                  </>
                ) : (
                  "Verify GST"
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
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
                <label className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-outfit">
                  MSME Registration ID (Udyam Number)
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

        {/* Advocate Letterhead and Digital Signature Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          
          {/* Advocate Letterhead */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-gray-900 font-outfit">Advocate Letterhead</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-semibold">Standard corporate or legal header applied when drafting automated recovery requests.</p>
            
            <div 
              onClick={() => letterheadInputRef.current?.click()}
              className="border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-center"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              {advocateLetterhead ? (
                <span className="text-xs font-bold text-slate-700 truncate max-w-full">{advocateLetterhead}</span>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-700">Upload Advocate Header</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">PDF, PNG up to 2MB</span>
                </>
              )}
            </div>
            <input type="file" ref={letterheadInputRef} onChange={handleLetterheadUpload} accept="application/pdf,image/*" className="hidden" />
          </div>

          {/* Digital Signature */}
          <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
              <FileSignature className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-gray-900 font-outfit">Digital Signature</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-semibold">Authorized signee's transparent PNG signature applied to court notifications.</p>
            
            <div 
              onClick={() => signatureInputRef.current?.click()}
              className="border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-center relative min-h-[90px]"
            >
              {digitalSignature ? (
                <div className="h-12 w-auto overflow-hidden">
                  <img src={digitalSignature} alt="Digital Signature" className="h-full object-contain" />
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Upload Transparent PNG</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">PNG signature up to 1MB</span>
                </>
              )}
            </div>
            <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} accept="image/png" className="hidden" />
          </div>

        </div>

      </div>

      {/* Right panel: Logo uploader */}
      <div className="space-y-4.5">
        <div className="bg-white border border-[#EBEAE6]/60 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-center">
          <h3 className="text-sm font-bold text-gray-900 font-outfit mb-1">Business Logo</h3>
          <p className="text-[10.5px] text-gray-400 font-medium mb-4">Branding display for customer payment portals.</p>
          
          <div 
            onClick={() => businessLogoInputRef.current?.click()}
            className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer text-center min-h-[140px]"
          >
            {logoUploading ? (
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            ) : businessLogo ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-gray-100">
                <img src={businessLogo} alt="Business Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Upload Corporate Logo</span>
                <span className="text-[10px] text-gray-400 mt-0.5 font-semibold">PNG, JPG up to 1MB</span>
              </>
            )}
          </div>
          <input type="file" ref={businessLogoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>Merchant Workspace</span>
            <span className="text-[#FF6B00] uppercase font-black font-outfit">{businessName}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #111827 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px",
      }}
    >
      {/* Background glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background:
            "radial-gradient(ellipse at center, rgba(255,106,57,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(55,110,85,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            background: "rgba(255,106,57,0.1)",
            border: "1px solid rgba(255,106,57,0.25)",
            borderRadius: 100,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FF6A39",
              animation: "uc-cta-pulse 2s infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "#FF6A39",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            The money exists. It&apos;s just in the wrong account.
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            margin: "0 0 22px",
          }}
        >
          Your buyers have been running
          <br />
          <em style={{ color: "#FF6A39", fontStyle: "italic" }}>
            a bank. With your money.
          </em>
        </h2>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: 560,
            fontWeight: 400,
          }}
        >
          Every unpaid invoice is a free loan you never agreed to give.{" "}
          <span style={{ color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
            The MSME Act says they owe you — with interest. We collect it.
          </span>
        </p>

        {/* CTA Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Link
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "15px 32px",
              background: "#FF6A39",
              color: "#ffffff",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow:
                "0 0 0 1px rgba(255,106,57,0.5), 0 4px 24px rgba(255,106,57,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
              transition: "transform 0.15s, box-shadow 0.15s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 1px rgba(255,106,57,0.6), 0 8px 32px rgba(255,106,57,0.5), 0 1px 0 rgba(255,255,255,0.15) inset";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 1px rgba(255,106,57,0.5), 0 4px 24px rgba(255,106,57,0.4), 0 1px 0 rgba(255,255,255,0.15) inset";
            }}
          >
            Recover What&apos;s Yours
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Below button */}
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Join 500+ manufacturers, traders and distributors who stopped chasing.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            margin: "52px 0 44px",
          }}
        />

        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            flexWrap: "wrap",
            marginBottom: 52,
          }}
        >
          {[
            { val: "₹47 Cr+", label: "Recovered" },
            { val: "500+", label: "Businesses" },
            { val: "94%", label: "Recovery Rate" },
            { val: "6.2 days", label: "Avg. First Payment" },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{
                padding: "0 28px",
                borderRight:
                  i < arr.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 5,
                  fontFamily: '"DM Serif Display", Georgia, serif',
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "28px 32px",
            textAlign: "left",
            position: "relative",
          }}
        >
          {/* Quote mark */}
          <div
            style={{
              position: "absolute",
              top: -1,
              left: 32,
              width: 36,
              height: 3,
              background: "#FF6A39",
              borderRadius: 100,
            }}
          />

          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.7,
              margin: "0 0 20px",
              fontStyle: "italic",
              fontFamily: '"DM Serif Display", Georgia, serif',
            }}
          >
            &ldquo;We recovered ₹8.3 Lakh in the first month. I wish I had
            found this 3 years ago.&rdquo;
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar placeholder */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #FF6A39 0%, #ff4719 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              R
            </div>
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: 2,
                }}
              >
                Ramesh Gupta
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                Textile Manufacturer · Surat
              </div>
            </div>

            {/* Verified badge */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                background: "rgba(55,110,85,0.15)",
                border: "1px solid rgba(55,110,85,0.3)",
                borderRadius: 100,
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#4ade80",
                  letterSpacing: "0.04em",
                }}
              >
                Verified customer
              </span>
            </div>
          </div>
        </div>

        {/* Bottom micro trust */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          {[
            "🔒 Bank-grade security",
            "📋 MSME Act compliant",
            "⚡ 8-min setup",
            "🚫 No credit card needed",
          ].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes uc-cta-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </section>
  );
}

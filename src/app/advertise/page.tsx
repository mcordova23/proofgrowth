"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckoutSession, SponsorData } from "../actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ── Design tokens ──
const BG = "#FAFAFA";
const CARD = "#FFFFFF";
const BORDER = "#E5E5E5";
const TXT = "#111111";
const MUTED = "#6B7280";
const G = "#22C55E";
const SANS = "Inter, system-ui, sans-serif";

export default function AdvertisePage() {
  const [step, setStep] = useState<"form" | "checkout">("form");
  const [formData, setFormData] = useState<SponsorData>({
    title: "",
    description: "",
    websiteUrl: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<SponsorData>>({});

  const validate = () => {
    const newErrors: Partial<SponsorData> = {};
    if (!formData.title.trim()) newErrors.title = "Sponsor title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.websiteUrl.trim())
      newErrors.websiteUrl = "Website URL is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep("checkout");
    }
  };

  const startCheckoutSessionForProduct = useCallback(
    () => startCheckoutSession("sponsor-spot-monthly", formData),
    [formData]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: SANS,
        color: TXT,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: `1px solid ${BORDER}`,
          background: CARD,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: TXT,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: G,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>ProofGrowth</span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: 14,
            color: MUTED,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Back to Home
        </Link>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "-1px",
              margin: "0 0 12px",
            }}
          >
            Advertise on ProofGrowth
          </h1>
          <p style={{ fontSize: 16, color: MUTED, margin: 0 }}>
            Audience: newsletter creators with verified metrics, actively
            growing their reach.
          </p>
        </div>

        {/* Stats banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `${G}08`,
            borderRadius: 12,
            padding: "12px 20px",
            marginBottom: 32,
            border: `1px solid ${G}20`,
          }}
        >
          <span style={{ fontSize: 14, color: TXT }}>
            Get seen by{" "}
            <strong style={{ color: G }}>500+ newsletter creators</strong> who
            visit ProofGrowth every month
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: G,
              background: `${G}15`,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            Verified Traffic
          </span>
        </div>

        {step === "form" ? (
          <div
            style={{
              background: CARD,
              borderRadius: 16,
              border: `1px solid ${BORDER}`,
              padding: 32,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              Become a Featured Sponsor
            </h2>
            <p style={{ fontSize: 14, color: MUTED, margin: "0 0 24px" }}>
              Your product will be showcased prominently on our homepage,
              reaching thousands of newsletter creators.
            </p>

            {/* Availability & Month */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: BG,
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ color: MUTED }}
                >
                  <path
                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: TXT }}>
                  3 of 4 spots available
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ color: MUTED }}
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="10"
                    x2="21"
                    y2="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span style={{ fontSize: 12, color: MUTED }}>
                  For{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long" })}
                </span>
              </div>
            </div>

            {/* Pricing Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${G}08 0%, ${G}15 100%)`,
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 28,
                border: `1px solid ${G}30`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <span
                    style={{ fontSize: 32, fontWeight: 800, color: TXT }}
                  >
                    $49
                  </span>
                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      margin: "4px 0 0",
                    }}
                  >
                    One-off payment for a full calendar month
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4"
                        stroke={G}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 12, color: TXT }}>
                      Premium placement
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4"
                        stroke={G}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 12, color: TXT }}>
                      Custom logo and link
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 12, color: "#F59E0B" }}>
                      Price rising to $99 soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div
              style={{
                background: BG,
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 28,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TXT,
                  margin: "0 0 6px",
                }}
              >
                How it works:
              </p>
              <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                Sponsorships run for a full calendar month. Pay anytime to
                secure your spot for{" "}
                <strong>
                  {new Date().toLocaleDateString("en-US", { month: "long" })}
                </strong>
                . Your sponsorship will be featured starting the 1st.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TXT,
                    marginBottom: 6,
                  }}
                >
                  Sponsor Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Your SaaS Platform"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: 14,
                    borderRadius: 10,
                    border: `1px solid ${errors.title ? "#EF4444" : BORDER}`,
                    background: BG,
                    fontFamily: SANS,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: errors.title ? "#EF4444" : MUTED,
                    margin: "6px 0 0",
                  }}
                >
                  {errors.title ||
                    "The headline that will appear on your sponsor card"}
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TXT,
                    marginBottom: 6,
                  }}
                >
                  Description
                </label>
                <textarea
                  placeholder="Describe your product or service..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: 14,
                    borderRadius: 10,
                    border: `1px solid ${errors.description ? "#EF4444" : BORDER}`,
                    background: BG,
                    fontFamily: SANS,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: errors.description ? "#EF4444" : MUTED,
                    margin: "6px 0 0",
                  }}
                >
                  {errors.description ||
                    "A brief description of what you offer (max 500 characters)"}
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TXT,
                    marginBottom: 6,
                  }}
                >
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: 14,
                    borderRadius: 10,
                    border: `1px solid ${errors.websiteUrl ? "#EF4444" : BORDER}`,
                    background: BG,
                    fontFamily: SANS,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: errors.websiteUrl ? "#EF4444" : MUTED,
                    margin: "6px 0 0",
                  }}
                >
                  {errors.websiteUrl ||
                    "Where should visitors be directed when they click?"}
                </p>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TXT,
                    marginBottom: 6,
                  }}
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: 14,
                    borderRadius: 10,
                    border: `1px solid ${errors.email ? "#EF4444" : BORDER}`,
                    background: BG,
                    fontFamily: SANS,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: errors.email ? "#EF4444" : MUTED,
                    margin: "6px 0 0",
                  }}
                >
                  {errors.email ||
                    "We'll send your confirmation to this email"}
                </p>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  background: G,
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "opacity 0.2s",
                }}
              >
                Secure Your Spot - $49
              </button>
              <p
                style={{
                  fontSize: 12,
                  color: MUTED,
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                You&apos;ll be redirected to Stripe to complete your secure
                payment.
              </p>
            </form>
          </div>
        ) : (
          <div
            style={{
              background: CARD,
              borderRadius: 16,
              border: `1px solid ${BORDER}`,
              padding: 32,
            }}
          >
            <button
              onClick={() => setStep("form")}
              style={{
                background: "none",
                border: "none",
                color: MUTED,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                fontFamily: SANS,
              }}
            >
              ← Back to form
            </button>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              Complete Payment
            </h2>
            <p style={{ fontSize: 14, color: MUTED, margin: "0 0 24px" }}>
              Sponsoring as: <strong>{formData.title}</strong>
            </p>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: startCheckoutSessionForProduct }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {/* What sponsors say */}
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: TXT,
              marginBottom: 20,
            }}
          >
            What sponsors say
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                name: "Sarah K.",
                company: "NewsletterOS",
                quote:
                  "ProofGrowth brought me 12 new paying subscribers in the first week. Absolutely worth it.",
              },
              {
                name: "Mike T.",
                company: "GrowthKit",
                quote:
                  "One of the best marketing decisions I've made. The audience is incredibly targeted.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                style={{
                  background: CARD,
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `${G}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: G,
                    }}
                  >
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: TXT,
                      }}
                    >
                      {testimonial.name}
                    </span>
                    <span style={{ fontSize: 12, color: MUTED }}>
                      {" "}
                      · {testimonial.company}
                    </span>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{ color: "#F59E0B", fontSize: 12 }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: TXT,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

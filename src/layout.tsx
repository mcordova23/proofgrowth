export const metadata = {
  title: "ProofGrowth — The Database of Verified Growth",
  description: "Browse API-verified subscribers, open rates, and revenue from real newsletters and startups. Kill the screenshot. Prove your growth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

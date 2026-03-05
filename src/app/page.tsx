"use client";
import { useState, useEffect } from "react";
// ── Colors — Light Theme ──
const G = "#00B847", R = "#E53535", BG = "#FFFFFF", CARD = "#F7F7F8";
const BORDER = "#E5E5EA", TXT = "#111113", MUTED = "#8E8E93";
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Outfit', system-ui, sans-serif";
// ── Badge ──
const Badge = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={G}/>
    <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Dot = ({ c = G }: { c?: string }) => (
  <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:c, boxShadow:`0 0 8px ${c}40` }}/>
);
// ── Spark ──
const Spark = ({ data, color = G, w = 80, h = 24 }: { data: number[], color?: string, w?: number, h?: number }) => {
  const mx = Math.max(...data), mn = Math.min(...data), rng = mx - mn || 1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-mn)/rng)*(h-4)-2}`).join(" ");
  return <svg width={w} height={h} style={{overflow:"visible"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
};
// ── Button ──
const Btn = ({ children, primary, small, onClick, style: s = {}, disabled }: any) => (
  <button disabled={disabled} onClick={onClick} style={{
    padding: small ? "8px 18px" : "14px 30px",
    borderRadius: 11, border: primary ? "none" : `1px solid ${BORDER}`,
    background: primary ? (disabled ? MUTED : G) : BG,
    color: primary ? "#fff" : TXT,
    fontSize: small ? 13 : 16, fontWeight: 800, cursor: disabled ? "default" : "pointer",
    fontFamily: SANS, opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
    boxShadow: primary ? `0 2px 12px ${G}30` : "none", ...s,
  }}>{children}</button>
);
// ── Input ──
const Input = ({ label, value, onChange, placeholder, type = "text", mono }: any) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display:"block", fontSize:12, fontWeight:700, color:MUTED, marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>{label}</label>
    <input type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} style={{
      width:"100%", padding:"12px 16px", borderRadius:10, border:`1px solid ${BORDER}`,
      background: BG, color: mono ? G : TXT, fontSize:15, fontFamily: mono ? MONO : SANS,
      outline:"none", boxSizing:"border-box" as const,
    }}/>
  </div>
);
// ── Select ──
const Select = ({ label, value, onChange, options }: any) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display:"block", fontSize:12, fontWeight:700, color:MUTED, marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>{label}</label>
    <select value={value} onChange={(e: any) => onChange(e.target.value)} style={{
      width:"100%", padding:"12px 16px", borderRadius:10, border:`1px solid ${BORDER}`,
      background: BG, color: TXT, fontSize:15, fontFamily: SANS, outline:"none", boxSizing:"border-box" as const,
    }}>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
// ── Storage helpers ──
async function saveSubmission(data: any) {
  try {
    const existing = await loadSubmissions();
    existing.push({ ...data, id: Date.now().toString(), submittedAt: new Date().toISOString(), status: "pending" });
    localStorage.setItem("pg-submissions", JSON.stringify(existing));
    return true;
  } catch(e) { console.error(e); return false; }
}
async function loadSubmissions() {
  try {
    const r = localStorage.getItem("pg-submissions");
    return r ? JSON.parse(r) : [];
  } catch { return []; }
}
async function updateSubmission(id: string, updates: any) {
  try {
    const all = await loadSubmissions();
    const idx = all.findIndex((s: any) => s.id === id);
    if (idx >= 0) { all[idx] = { ...all[idx], ...updates }; localStorage.setItem("pg-submissions", JSON.stringify(all)); }
    return all;
  } catch(e) { console.error(e); return []; }
}
async function deleteSubmission(id: string) {
  try {
    const all = await loadSubmissions();
    const filtered = all.filter((s: any) => s.id !== id);
    localStorage.setItem("pg-submissions", JSON.stringify(filtered));
    return filtered;
  } catch(e) { console.error(e); return []; }
}
// ── Demo data ──
const DEMO_PROFILES = [
  { name:"The Growth Letter", category:"Marketing", subscribers:"45,200", openRate:"52.1%", ctr:"8.3%", growth:"+18.3%", spark:[28000,30200,33100,35800,37200,39400,41000,42800,44100,45200], verified:true },
  { name:"Indie Hackers Weekly", category:"Startups", subscribers:"32,100", openRate:"47.8%", ctr:"6.1%", growth:"+14.7%", spark:[21000,22800,24100,25500,27200,28400,29800,30500,31200,32100], verified:true },
  { name:"AI Breakfast", category:"AI / Tech", subscribers:"28,400", openRate:"44.2%", ctr:"5.9%", growth:"+22.1%", spark:[15000,17200,19100,20800,22400,23800,25100,26500,27600,28400], verified:true },
  { name:"Be Reddy", category:"Reddit Marketing", subscribers:"22", openRate:"44%", ctr:"3.64%", growth:"+22", spark:[0,0,0,2,3,5,4,8,12,22], verified:true },
];
// ============================================
// PAGES
// ============================================
function Landing({ goTo }: { goTo: (p: string) => void }) {
  return (
    <div style={{ maxWidth:880, margin:"0 auto", padding:"20px 24px" }}>
      <div style={{ textAlign:"center", padding:"60px 0 0" }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:`${G}0C`, border:`1px solid ${G}20`,
          borderRadius:100, padding:"7px 18px", marginBottom:28,
        }}>
          <Dot/><span style={{ fontSize:13, fontWeight:700, color:G }}>Bye bye fake screenshots</span>
        </div>
        <h1 style={{ fontSize:"clamp(38px,7vw,68px)", fontWeight:900, lineHeight:1.04, letterSpacing:"-3px", margin:"0 0 20px", color:TXT }}>
          Prove your growth.<br/><span style={{color:G}}>Kill the screenshot.</span>
        </h1>
        <p style={{ fontSize:18, color:MUTED, maxWidth:480, margin:"0 auto 32px", lineHeight:1.6 }}>
          Connect one read-only API key. Get a verified public page
          with your real metrics. No more inspect element. No more Photoshop.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:14 }}>
          <Btn primary onClick={() => goTo("submit")}>Get Verified — It{"'"}s Free</Btn>
          <Btn onClick={() => goTo("leaderboard")}>Leaderboard</Btn>
        </div>
        <p style={{ fontSize:13, color:MUTED }}>Free forever · Dofollow backlink · 60 seconds</p>
      </div>

      {/* Problem */}
      <div style={{ padding:"80px 0 0", textAlign:"center" }}>
        <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:"-2px", margin:"0 0 12px", color:TXT }}>
          Everyone{"'"}s posting screenshots.<br/>Nobody{"'"}s proving anything.
        </h2>
        <p style={{ fontSize:16, color:MUTED, maxWidth:500, margin:"0 auto 36px" }}>
          {'"'}$200K in course sales.{'"'} {'"'}50K subscribers.{'"'} {'"'}10,000 daily signups.{'"'}
          All from screenshots anyone can fake in 30 seconds.
        </p>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:260, background:CARD, borderRadius:16, border:`1px solid ${R}20`, padding:24, textAlign:"left" }}>
            <div style={{ display:"inline-flex", gap:6, alignItems:"center", background:`${R}0A`, borderRadius:8, padding:"4px 12px", marginBottom:16 }}>
              <span style={{ fontSize:12, fontWeight:800, color:R }}>✕ SCREENSHOT</span>
            </div>
            <p style={{ fontSize:15, color:TXT, lineHeight:1.6, margin:"0 0 14px" }}>
              {'"'}My client just did $200K in course sales from a 750 person email list in 60 days!!!{'"'}
            </p>
            <div style={{ background:`${R}06`, border:`1px solid ${R}15`, borderRadius:10, padding:"10px 14px" }}>
              <span style={{ fontSize:10, color:MUTED, fontWeight:700, display:"block", marginBottom:2 }}>PROOF</span>
              <span style={{ fontSize:14, color:R, fontWeight:700 }}>A Slack message screenshot 🤷</span>
            </div>
          </div>
          <div style={{ flex:1, minWidth:260, background:CARD, borderRadius:16, border:`1px solid ${G}25`, padding:24, textAlign:"left" }}>
            <div style={{ display:"inline-flex", gap:6, alignItems:"center", background:`${G}0C`, borderRadius:8, padding:"4px 12px", marginBottom:16 }}>
              <Badge s={13}/><span style={{ fontSize:12, fontWeight:800, color:G }}>VERIFIED</span>
            </div>
            <p style={{ fontSize:15, color:TXT, lineHeight:1.6, margin:"0 0 14px" }}>
              Real metrics pulled directly from Beehiiv API. Updated hourly. No way to edit.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              {[{l:"Subs",v:"22"},{l:"Open",v:"44%"},{l:"CTR",v:"3.64%"}].map((m,i) => (
                <div key={i} style={{ flex:1, background:BG, borderRadius:8, padding:"8px 10px", border:`1px solid ${G}20` }}>
                  <span style={{ fontSize:9, color:MUTED, fontWeight:700, display:"block" }}>{m.l}</span>
                  <span style={{ fontSize:16, fontWeight:900, color:G, fontFamily:MONO }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:"80px 0 0", textAlign:"center" }}>
        <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:"-2px", margin:"0 0 36px", color:TXT }}>
          One API key. That{"'"}s it.
        </h2>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {[
            { n:"01", t:"Connect", d:"Add a read-only API key from Beehiiv, ConvertKit, or Substack. Takes 60 seconds." },
            { n:"02", t:"We verify", d:"Subscribers, open rate, CTR, growth — pulled from the source. No screenshots." },
            { n:"03", t:"Show proof", d:"Get a live verified page + embeddable badge + free dofollow backlink." },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, minWidth:220, background:CARD, borderRadius:16, padding:24, border:`1px solid ${BORDER}`, textAlign:"left" }}>
              <span style={{ fontSize:36, fontWeight:900, color:`${G}18`, fontFamily:MONO, display:"block", marginBottom:12 }}>{s.n}</span>
              <h3 style={{ fontSize:18, fontWeight:800, margin:"0 0 8px", color:TXT }}>{s.t}</h3>
              <p style={{ fontSize:14, color:MUTED, lineHeight:1.6, margin:0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard preview */}
      <div style={{ padding:"80px 0 0", textAlign:"center" }}>
        <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:"-2px", margin:"0 0 36px", color:TXT }}>
          Real numbers. Ranked.
        </h2>
        <div style={{ background:CARD, borderRadius:16, border:`1px solid ${BORDER}`, padding:"4px 20px 12px", textAlign:"left" }}>
          {DEMO_PROFILES.map((p,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", padding:"14px 0", borderBottom: i < DEMO_PROFILES.length-1 ? `1px solid ${BORDER}` : "none", gap:14 }}>
              <span style={{ fontSize:13, fontWeight:800, color: i < 3 ? G : MUTED, fontFamily:MONO, width:26, textAlign:"center" }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:TXT }}>{p.name}</span><Badge s={13}/>
                </div>
                <span style={{ fontSize:11, color:MUTED }}>{p.category}</span>
              </div>
              <div style={{ textAlign:"right", minWidth:64 }}>
                <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:MONO }}>{p.subscribers}</span>
                <span style={{ fontSize:10, color:MUTED, display:"block" }}>subs</span>
              </div>
              <div style={{ textAlign:"right", minWidth:48 }}>
                <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:MONO }}>{p.openRate}</span>
                <span style={{ fontSize:10, color:MUTED, display:"block" }}>open</span>
              </div>
              <div style={{ textAlign:"right", minWidth:48 }}>
                <span style={{ fontSize:13, fontWeight:600, color:G, fontFamily:MONO }}>{p.growth}</span>
                <span style={{ fontSize:10, color:MUTED, display:"block" }}>30d</span>
              </div>
              <div style={{ width:72 }}><Spark data={p.spark}/></div>
            </div>
          ))}
        </div>
        <Btn small onClick={() => goTo("leaderboard")} style={{ marginTop:20 }}>View Full Leaderboard →</Btn>
      </div>

      {/* CTA */}
      <div style={{ padding:"80px 0 60px" }}>
        <div style={{
          borderRadius:20, padding:"56px 32px", textAlign:"center",
          background:`linear-gradient(180deg, ${G}08 0%, transparent 60%)`,
          border:`1px solid ${G}18`,
        }}>
          <h2 style={{ fontSize:"clamp(28px,5vw,44px)", fontWeight:900, letterSpacing:"-2px", margin:"0 0 14px", lineHeight:1.1, color:TXT }}>
            Stop posting screenshots.<br/><span style={{color:G}}>Start proving metrics.</span>
          </h2>
          <p style={{ fontSize:16, color:MUTED, maxWidth:400, margin:"0 auto 24px" }}>
            Free to list. Dofollow backlink. 60 seconds. No catch.
          </p>
          <Btn primary onClick={() => goTo("submit")}>Get Verified Now</Btn>
        </div>
      </div>
    </div>
  );
}

function SubmitForm({ goTo }: { goTo: (p: string) => void }) {
  const [name, setName] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("beehiiv");
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("marketing");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = name && newsletter && email && apiKey;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true); setError("");
    const ok = await saveSubmission({ name, newsletter, email, url, platform, apiKey, category });
    setSubmitting(false);
    if (ok) setDone(true); else setError("Something went wrong. Please try again.");
  }

  if (done) {
    return (
      <div style={{ maxWidth:520, margin:"0 auto", padding:"80px 24px", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:20, background:`${G}10`, border:`1px solid ${G}25`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}><Badge s={40}/></div>
        <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:"-1.5px", margin:"0 0 12px", color:TXT }}>You{"'"}re in the queue!</h2>
        <p style={{ fontSize:17, color:MUTED, lineHeight:1.6, margin:"0 0 8px" }}>We{"'"}re verifying your metrics now. Your verified profile will be live within 24 hours.</p>
        <p style={{ fontSize:14, color:MUTED, margin:"0 0 32px" }}>We{"'"}ll email you at <span style={{ color:TXT, fontWeight:600 }}>{email}</span> when it{"'"}s ready.</p>
        <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
          <Btn onClick={() => goTo("landing")}>← Back Home</Btn>
          <Btn onClick={() => goTo("leaderboard")}>View Leaderboard</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:520, margin:"0 auto", padding:"40px 24px" }}>
      <button onClick={() => goTo("landing")} style={{ background:"none", border:"none", color:MUTED, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:SANS, marginBottom:24, padding:0 }}>← Back</button>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <Badge s={24}/><h2 style={{ fontSize:28, fontWeight:900, letterSpacing:"-1px", margin:0, color:TXT }}>Get Verified</h2>
      </div>
      <p style={{ fontSize:15, color:MUTED, margin:"0 0 32px", lineHeight:1.5 }}>Connect your newsletter platform. We{"'"}ll pull your real metrics and create your verified public profile. Free forever.</p>
      <div style={{ background:CARD, borderRadius:16, border:`1px solid ${BORDER}`, padding:28 }}>
        <Input label="Your name" value={name} onChange={setName} placeholder="Max"/>
        <Input label="Newsletter name" value={newsletter} onChange={setNewsletter} placeholder="Be Reddy"/>
        <Input label="Email" value={email} onChange={setEmail} placeholder="max@bereddy.com" type="email"/>
        <Input label="Newsletter URL (optional)" value={url} onChange={setUrl} placeholder="https://bereddy.beehiiv.com"/>
        <Select label="Platform" value={platform} onChange={setPlatform} options={[
          { value:"beehiiv", label:"Beehiiv" },{ value:"convertkit", label:"ConvertKit" },{ value:"substack", label:"Substack" },{ value:"mailchimp", label:"Mailchimp" },{ value:"other", label:"Other" },
        ]}/>
        <Select label="Category" value={category} onChange={setCategory} options={[
          { value:"marketing", label:"Marketing" },{ value:"tech", label:"Tech / AI" },{ value:"startups", label:"Startups" },{ value:"creator", label:"Creator Economy" },{ value:"finance", label:"Finance" },{ value:"health", label:"Health & Wellness" },{ value:"other", label:"Other" },
        ]}/>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:700, color:MUTED, marginBottom:6, textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>Read-only API Key</label>
          <input type="password" value={apiKey} onChange={(e: any) => setApiKey(e.target.value)} placeholder="pub_xxxxxxxx..." style={{
            width:"100%", padding:"12px 16px", borderRadius:10, border:`1px solid ${BORDER}`,
            background: BG, color: G, fontSize:14, fontFamily: MONO, outline:"none", boxSizing:"border-box" as const,
          }}/>
          <p style={{ fontSize:12, color:MUTED, margin:"8px 0 0", lineHeight:1.5 }}>We only use read-only keys. We can never modify your data.<br/>Find yours at: Settings → API in your Beehiiv dashboard.</p>
        </div>
        <div style={{ background:`${G}08`, border:`1px solid ${G}18`, borderRadius:10, padding:"12px 16px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:10 }}>
          <Badge s={16}/>
          <div>
            <span style={{ fontSize:13, fontWeight:700, color:TXT, display:"block", marginBottom:2 }}>Your data is safe</span>
            <span style={{ fontSize:12, color:MUTED, lineHeight:1.5 }}>Read-only API keys cannot modify your account. We only pull aggregate metrics — never individual subscriber data.</span>
          </div>
        </div>
        {error && <p style={{ fontSize:14, color:R, marginBottom:16 }}>{error}</p>}
        <Btn primary onClick={handleSubmit} disabled={!canSubmit || submitting} style={{ width:"100%" }}>
          {submitting ? "Submitting..." : "Submit for Verification"}
        </Btn>
      </div>
    </div>
  );
}

function LeaderboardPage({ goTo }: { goTo: (p: string) => void }) {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => { (async () => { const s = await loadSubmissions(); setSubs(s.filter((x: any) => x.status === "verified")); })(); }, []);
  const all = [...DEMO_PROFILES, ...subs.map((s: any) => ({
    name: s.newsletter, category: s.category, subscribers: "—", openRate: "—", ctr: "—", growth: "—", spark: [0,1,2,3,4,5,6,7,8,9], verified: true,
  }))];
  return (
    <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
        <button onClick={() => goTo("landing")} style={{ background:"none", border:"none", color:MUTED, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:SANS, padding:0 }}>← Back</button>
        <Btn primary small onClick={() => goTo("submit")}>Get Verified</Btn>
      </div>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:"-2px", margin:"0 0 10px", color:TXT }}>Leaderboard</h2>
        <p style={{ fontSize:16, color:MUTED }}>Every metric verified via API. Zero exceptions.</p>
      </div>
      <div style={{ background:CARD, borderRadius:18, border:`1px solid ${BORDER}`, padding:"4px 22px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${BORDER}` }}>
          <span style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase" as const, letterSpacing:"0.08em" }}>Sorted by subscribers</span>
        </div>
        {all.map((p: any,i: number) => (
          <div key={i} style={{ display:"flex", alignItems:"center", padding:"14px 0", borderBottom: i < all.length-1 ? `1px solid ${BORDER}` : "none", gap:14 }}>
            <span style={{ fontSize:13, fontWeight:800, color: i < 3 ? G : MUTED, fontFamily:MONO, width:26, textAlign:"center" }}>{i+1}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color:TXT }}>{p.name}</span><Badge s={13}/>
              </div>
              <span style={{ fontSize:11, color:MUTED }}>{p.category}</span>
            </div>
            <div style={{ textAlign:"right", minWidth:64 }}>
              <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:MONO }}>{p.subscribers}</span>
              <span style={{ fontSize:10, color:MUTED, display:"block" }}>subs</span>
            </div>
            <div style={{ textAlign:"right", minWidth:48 }}>
              <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:MONO }}>{p.openRate}</span>
              <span style={{ fontSize:10, color:MUTED, display:"block" }}>open</span>
            </div>
            <div style={{ textAlign:"right", minWidth:48 }}>
              <span style={{ fontSize:13, fontWeight:600, color:G, fontFamily:MONO }}>{p.growth}</span>
              <span style={{ fontSize:10, color:MUTED, display:"block" }}>30d</span>
            </div>
            <div style={{ width:72 }}><Spark data={p.spark}/></div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:40 }}>
        <p style={{ fontSize:15, color:MUTED, marginBottom:16 }}>Want to see your newsletter on this board?</p>
        <Btn primary onClick={() => goTo("submit")}>Get Verified — Free</Btn>
      </div>
    </div>
  );
}

function AdminPage({ goTo }: { goTo: (p: string) => void }) {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  async function load() { setLoading(true); setSubs(await loadSubmissions()); setLoading(false); }
  useEffect(() => { if (authed) load(); }, [authed]);
  if (!authed) {
    return (
      <div style={{ maxWidth:400, margin:"0 auto", padding:"80px 24px", textAlign:"center" }}>
        <h2 style={{ fontSize:24, fontWeight:900, margin:"0 0 24px", color:TXT }}>Admin Panel</h2>
        <Input label="Password" value={pass} onChange={setPass} type="password" placeholder="Enter admin password" mono/>
        <Btn primary onClick={() => { if (pass === "proofgrowth2026") setAuthed(true); }} style={{ width:"100%" }}>Login</Btn>
        <button onClick={() => goTo("landing")} style={{ background:"none", border:"none", color:MUTED, fontSize:13, cursor:"pointer", fontFamily:SANS, marginTop:16 }}>← Back</button>
      </div>
    );
  }
  const pending = subs.filter((s: any) => s.status === "pending");
  const verified = subs.filter((s: any) => s.status === "verified");
  return (
    <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
        <h2 style={{ fontSize:24, fontWeight:900, margin:0, color:TXT }}>Admin Panel</h2>
        <div style={{ display:"flex", gap:8 }}><Btn small onClick={load}>Refresh</Btn><Btn small onClick={() => goTo("landing")}>← Site</Btn></div>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom:32 }}>
        {[{l:"Pending",v:pending.length,c:"#E68A00"},{l:"Verified",v:verified.length,c:G},{l:"Total",v:subs.length,c:TXT}].map((s,i) => (
          <div key={i} style={{ flex:1, background:CARD, borderRadius:12, padding:"16px 18px", border:`1px solid ${BORDER}` }}>
            <span style={{ fontSize:11, color:MUTED, fontWeight:700, display:"block", marginBottom:4 }}>{s.l}</span>
            <span style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:MONO }}>{s.v}</span>
          </div>
        ))}
      </div>
      {pending.length > 0 && <>
        <h3 style={{ fontSize:16, fontWeight:800, color:"#E68A00", margin:"0 0 14px" }}>⏳ Pending ({pending.length})</h3>
        {pending.map((s: any) => (
          <div key={s.id} style={{ background:CARD, borderRadius:14, border:`1px solid #E68A0025`, padding:20, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div><span style={{ fontSize:16, fontWeight:800, color:TXT, display:"block" }}>{s.newsletter}</span><span style={{ fontSize:13, color:MUTED }}>{s.name} · {s.email}</span></div>
              <span style={{ fontSize:11, color:MUTED }}>{new Date(s.submittedAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
              {[s.platform, s.category, s.url].filter(Boolean).map((t: string, i: number) => (
                <span key={i} style={{ fontSize:12, background:BG, borderRadius:6, padding:"4px 10px", color:MUTED, border:`1px solid ${BORDER}` }}>{t}</span>
              ))}
            </div>
            <div style={{ background:BG, borderRadius:8, padding:"10px 14px", marginBottom:14, border:`1px solid ${BORDER}` }}>
              <span style={{ fontSize:11, color:MUTED, fontWeight:700, display:"block", marginBottom:4 }}>API KEY</span>
              <span style={{ fontSize:13, color:G, fontFamily:MONO, wordBreak:"break-all" as const }}>{s.apiKey}</span>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn primary small onClick={async () => setSubs(await updateSubmission(s.id, { status:"verified" }))}>✓ Verify</Btn>
              <Btn small onClick={async () => setSubs(await updateSubmission(s.id, { status:"rejected" }))} style={{ borderColor:`${R}30`, color:R }}>✕ Reject</Btn>
              <Btn small onClick={async () => setSubs(await deleteSubmission(s.id))} style={{ color:MUTED }}>Delete</Btn>
            </div>
          </div>
        ))}
      </>}
      {verified.length > 0 && <>
        <h3 style={{ fontSize:16, fontWeight:800, color:G, margin:"24px 0 14px" }}>✓ Verified ({verified.length})</h3>
        {verified.map((s: any) => (
          <div key={s.id} style={{ background:CARD, borderRadius:14, border:`1px solid ${G}20`, padding:16, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:14, fontWeight:700, color:TXT }}>{s.newsletter}</span><Badge s={14}/></div><span style={{ fontSize:12, color:MUTED }}>{s.name} · {s.platform}</span></div>
            <Btn small onClick={async () => setSubs(await deleteSubmission(s.id))} style={{ color:MUTED }}>Remove</Btn>
          </div>
        ))}
      </>}
      {subs.length === 0 && !loading && <div style={{ textAlign:"center", padding:"60px 0", color:MUTED }}><p>No submissions yet.</p></div>}
    </div>
  );
}

// ============================================
// APP
// ============================================
export default function ProofGrowth() {
  const [page, setPage] = useState("landing");
  const goTo = (p: string) => { setPage(p); window.scrollTo(0,0); };
  return (
    <div style={{ fontFamily:SANS, background:BG, color:TXT, minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <nav style={{ maxWidth:880, margin:"0 auto", padding:"20px 24px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div onClick={() => goTo("landing")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <div style={{ width:28, height:28, borderRadius:7, background:G, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize:18, fontWeight:900, letterSpacing:"-0.5px", color:TXT }}>ProofGrowth</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn small onClick={() => goTo("leaderboard")}>Leaderboard</Btn>
          <Btn small onClick={() => goTo("admin")} style={{ color:MUTED, borderColor:"transparent" }}>Admin</Btn>
          <Btn primary small onClick={() => goTo("submit")}>Get Verified</Btn>
        </div>
      </nav>
      {page === "landing" && <Landing goTo={goTo}/>}
      {page === "submit" && <SubmitForm goTo={goTo}/>}
      {page === "leaderboard" && <LeaderboardPage goTo={goTo}/>}
      {page === "admin" && <AdminPage goTo={goTo}/>}
    </div>
  );
}

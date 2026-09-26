import { useMemo, useState } from "react";
import { FiAnchor, FiArrowRight, FiCalendar, FiCheck, FiInfo, FiMapPin, FiSearch, FiStar } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import "../App.css";

const origins = ["Australia", "Indonesia", "Mozambique", "Russia", "United States"];
const destinations = ["Paradip", "Dhamra", "Visakhapatnam", "Gangavaram", "Kamarajar", "Chennai", "Haldia"];
const today = new Date().toISOString().slice(0, 10);

export default function OceanScanner() {
  const [form, setForm] = useState({ origin: "Australia", destination: "Paradip", cargo: "100000", date: today, type: "All vessel types" });
  const [results, setResults] = useState([]), [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false), [error, setError] = useState(""), [searched, setSearched] = useState(false);
  const [sort, setSort] = useState("Recommended"), [saved, setSaved] = useState([]);
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const shown = useMemo(() => results.filter((v) => form.type === "All vessel types" || v.vessel_type === form.type).sort((a, b) => sort === "Largest capacity" ? b.capacity_tonnes - a.capacity_tonnes : b.compatibility_score - a.compatibility_score), [results, sort, form.type]);

  async function search(event) {
    event.preventDefault(); setLoading(true); setError(""); setSearched(true); setSaved([]);
    try {
      const query = new URLSearchParams({ cargo_quantity: form.cargo, origin: form.origin, destination: form.destination });
      const response = await fetch(API_BASE_URL + "/api/vessels/feasibility?" + query, { headers: { Accept: "application/json" } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || "Could not scan vessels for this route.");
      setSummary(body.data); setResults((body.data.vessels || []).filter((v) => v.status === "FEASIBLE"));
    } catch (err) { setSummary(null); setResults([]); setError(err.message === "Failed to fetch" ? "Cannot reach the SAYLIV backend at 127.0.0.1:8000. Start the backend, then search again." : (err.message || "Could not reach the vessel service.")); }
    finally { setLoading(false); }
  }

  return <div className="ocean-page">
    <section className="ocean-hero">
      <div><span className="ocean-kicker"><FiAnchor /> SAYLIV OCEAN SCANNER</span><h1>Find the right vessel<br /><em>for your next voyage.</em></h1><p>Compare vessel fit for your cargo and route, all in one place.</p><div className="ocean-proof"><span><FiCheck /> Port compatibility</span><span><FiCheck /> Cargo fit</span><span><FiCheck /> Ranked matches</span></div></div>
      <div className="ocean-map-art" aria-hidden="true"><div className="ocean-globe"><i /><i /><b /></div><span className="ocean-arc" /><span className="ocean-map-pin pin-a">LOAD</span><span className="ocean-map-pin pin-b">DISCHARGE</span><span className="ocean-boat">🚢</span><small>YOUR ROUTE, SCANNED</small></div>
      <div className="ocean-hero-foot"><span><i /> Vessel intelligence online</span><span>Prototype fleet · explainable screening</span></div>
    </section>
    <section className="ocean-search-card">
      <div className="ocean-search-heading"><div><span className="ocean-label">START A NEW SEARCH</span><h2>Where does your cargo need to go?</h2></div><b><FiSearch /> Ocean Scanner</b></div>
      <form onSubmit={search}><div className="ocean-fields">
        <label className="ocean-field"><span><FiMapPin /> Loading region</span><select value={form.origin} onChange={(e) => update("origin", e.target.value)}>{origins.map((p) => <option key={p}>{p}</option>)}</select><small>Origin</small></label>
        <label className="ocean-field"><span><FiMapPin /> Discharge port</span><select value={form.destination} onChange={(e) => update("destination", e.target.value)}>{destinations.map((p) => <option key={p}>{p}</option>)}</select><small>Destination</small></label>
        <label className="ocean-field"><span><FiCalendar /> Cargo ready</span><input type="date" min={today} value={form.date} onChange={(e) => update("date", e.target.value)} /><small>Preferred laycan start</small></label>
        <label className="ocean-field"><span><FiAnchor /> Vessel type</span><select value={form.type} onChange={(e) => update("type", e.target.value)}><option>All vessel types</option><option>Capesize</option><option>Panamax</option><option>Handysize</option><option>Supramax</option></select><small>Any suitable class</small></label>
        <label className="ocean-field"><span>◉ Cargo quantity</span><div className="ocean-quantity"><input type="number" min="1000" max="1000000" step="1000" required value={form.cargo} onChange={(e) => update("cargo", e.target.value)} /><b>MT</b></div><small>Metric tonnes</small></label>
        <button className="ocean-search-button" disabled={loading}><FiSearch /> {loading ? "Scanning…" : "Search vessels"} <FiArrowRight /></button>
      </div></form>
      <p className="ocean-note"><FiInfo /> Cargo-ready date is a planning preference; this prototype does not check live vessel schedules or book charters.</p>
    </section>
    <section className="ocean-results"><div className="ocean-results-heading"><div><span className="ocean-label">MATCHES FOR YOUR VOYAGE</span><h2>{searched && summary ? shown.length + " vessels found" : "Your next match is out there"}</h2><p>{searched && summary ? summary.origin + " → " + summary.destination + " · " + Number(summary.cargo_quantity_tonnes).toLocaleString() + " MT · " + summary.total_vessels_checked + " vessels screened" : "Search to see vessels screened for cargo capacity and destination-port limits."}</p></div>{searched && summary && <label className="ocean-sort">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option>Recommended</option><option>Largest capacity</option></select></label>}</div>
      {error && <div className="ocean-error"><FiInfo /> {error}</div>}{loading && <div className="ocean-loading">Scanning fleet compatibility…</div>}
      {!loading && !searched && <div className="ocean-empty"><FiSearch /><div><b>Ready when you are</b><p>Enter your voyage details above to scan the available fleet.</p></div></div>}
      {!loading && searched && !error && shown.length === 0 && <div className="ocean-empty"><FiAnchor /><div><b>No suitable vessels found</b><p>Try another port, quantity or vessel class. This is a prototype fleet.</p></div></div>}
      <div className="ocean-vessel-list">{!loading && shown.map((vessel, index) => {
        const isSaved = saved.includes(vessel.vessel_id), utilization = Math.min(100, Math.round(Number(form.cargo) / vessel.capacity_tonnes * 100));
        return <article className="ocean-vessel" key={vessel.vessel_id}>
          <div className="ocean-vessel-title"><div><FiAnchor /></div><section><small>{index === 0 ? "BEST MATCH" : "FEASIBLE"}</small><h3>{vessel.vessel_name}</h3><p>{vessel.vessel_id} · {vessel.vessel_type}</p></section></div>
          <div className="ocean-metric"><span>COMPATIBILITY</span><b className="ocean-score">{vessel.compatibility_score}<small>/100</small></b><div className="ocean-meter"><i style={{ width: vessel.compatibility_score + "%" }} /></div></div>
          <div className="ocean-metric"><span>CARGO CAPACITY</span><b>{Number(vessel.capacity_tonnes).toLocaleString()} <small>MT</small></b><div className="ocean-capacity"><i style={{ width: utilization + "%" }} /><small>{utilization}% utilized</small></div></div>
          <div className="ocean-fit"><FiCheck /> Meets port & cargo limits</div>
          <button className={"ocean-shortlist " + (isSaved ? "is-saved" : "")} type="button" aria-pressed={isSaved} onClick={() => setSaved((old) => isSaved ? old.filter((x) => x !== vessel.vessel_id) : [...old, vessel.vessel_id])}><FiStar /> {isSaved ? "Shortlisted" : "Shortlist"}</button>
        </article>;
      })}</div>
      {searched && !loading && summary && shown.length > 0 && <p className="ocean-note"><FiInfo /> Scores rank vessel capacity and port fit; availability and laycan are not checked against a live schedule.</p>}
    </section>
  </div>;
}

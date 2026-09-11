import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiMapPin,
  FiClock,
  FiAnchor,
  FiNavigation,
  FiAlertTriangle,
  FiCheckCircle,
  FiCrosshair,
  FiFilter,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vessels = [
  {
    name: "MV SAIL Horizon",
    imo: "IMO 9876543",
    type: "Capesize",
    capacity: "82,000 MT",
    cargo: "Coking Coal",
    currentLocation: "Arabian Sea",
    origin: "Port Hedland",
    destination: "Paradip",
    status: "At Sea",
    eta: "12 Oct 2026",
    available: "12 Oct 2026",
    progress: 72,
    risk: "Low",
    voyage: "Australia → India",
    speed: "13.8 kn",
    position: [16.8, 73.4],
    originCoords: [-20.31, 118.58],
    destinationCoords: [20.26, 86.70],
    route: [
      [-20.31, 118.58],
      [-10.0, 108.0],
      [2.0, 101.0],
      [10.5, 90.0],
      [16.8, 73.4],
      [20.26, 86.70],
    ],
  },
  {
    name: "MV Ocean Carrier",
    imo: "IMO 9458120",
    type: "Capesize",
    capacity: "76,000 MT",
    cargo: "Iron Ore",
    currentLocation: "Indian Ocean",
    origin: "Newcastle",
    destination: "Paradip",
    status: "At Sea",
    eta: "14 Oct 2026",
    available: "14 Oct 2026",
    progress: 61,
    risk: "Low",
    voyage: "Australia → India",
    speed: "12.9 kn",
    position: [-7.2, 92.6],
    originCoords: [-32.93, 151.78],
    destinationCoords: [20.26, 86.70],
    route: [
      [-32.93, 151.78],
      [-25.0, 142.0],
      [-15.0, 120.0],
      [-7.2, 92.6],
      [8.0, 88.0],
      [20.26, 86.70],
    ],
  },
  {
    name: "MV Eastern Star",
    imo: "IMO 9712048",
    type: "Panamax",
    capacity: "64,000 MT",
    cargo: "Thermal Coal",
    currentLocation: "Port Hedland",
    origin: "Port Hedland",
    destination: "Visakhapatnam",
    status: "Loading",
    eta: "18 Oct 2026",
    available: "18 Oct 2026",
    progress: 28,
    risk: "Medium",
    voyage: "Australia → India",
    speed: "0.0 kn",
    position: [-20.31, 118.58],
    originCoords: [-20.31, 118.58],
    destinationCoords: [17.69, 83.22],
    route: [
      [-20.31, 118.58],
      [-10.0, 112.0],
      [2.0, 103.0],
      [10.0, 92.0],
      [17.69, 83.22],
    ],
  },
  {
    name: "MV Pacific Trader",
    imo: "IMO 9637811",
    type: "Capesize",
    capacity: "88,000 MT",
    cargo: "Iron Ore",
    currentLocation: "South China Sea",
    origin: "Gladstone",
    destination: "Paradip",
    status: "At Sea",
    eta: "20 Oct 2026",
    available: "20 Oct 2026",
    progress: 45,
    risk: "Medium",
    voyage: "Australia → India",
    speed: "11.7 kn",
    position: [11.8, 113.2],
    originCoords: [-23.84, 151.26],
    destinationCoords: [20.26, 86.70],
    route: [
      [-23.84, 151.26],
      [-18.0, 145.0],
      [-5.0, 130.0],
      [11.8, 113.2],
      [17.0, 98.0],
      [20.26, 86.70],
    ],
  },
  {
    name: "MV Coastal Star",
    imo: "IMO 9524306",
    type: "Panamax",
    capacity: "68,000 MT",
    cargo: "Thermal Coal",
    currentLocation: "Singapore Strait",
    origin: "Indonesia",
    destination: "Paradip",
    status: "Available",
    eta: "10 Oct 2026",
    available: "10 Oct 2026",
    progress: 100,
    risk: "Low",
    voyage: "Indonesia → India",
    speed: "0.0 kn",
    position: [1.28, 103.85],
    originCoords: [-6.10, 106.88],
    destinationCoords: [20.26, 86.70],
    route: [
      [-6.10, 106.88],
      [1.28, 103.85],
      [8.0, 96.0],
      [15.0, 90.0],
      [20.26, 86.70],
    ],
  },
  {
    name: "MV Bengal Voyager",
    imo: "IMO 9893127",
    type: "Supramax",
    capacity: "56,000 MT",
    cargo: "Bauxite",
    currentLocation: "Bay of Bengal",
    origin: "Indonesia",
    destination: "Kolkata",
    status: "At Sea",
    eta: "15 Oct 2026",
    available: "15 Oct 2026",
    progress: 67,
    risk: "Low",
    voyage: "Indonesia → India",
    speed: "12.2 kn",
    position: [12.4, 91.7],
    originCoords: [-6.10, 106.88],
    destinationCoords: [22.57, 88.36],
    route: [
      [-6.10, 106.88],
      [1.28, 103.85],
      [7.0, 98.0],
      [12.4, 91.7],
      [22.57, 88.36],
    ],
  },
  {
    name: "MV Arabian Pearl",
    imo: "IMO 9765114",
    type: "Panamax",
    capacity: "72,000 MT",
    cargo: "Coking Coal",
    currentLocation: "Arabian Sea",
    origin: "Richards Bay",
    destination: "Mundra",
    status: "Delayed",
    eta: "16 Oct 2026",
    available: "17 Oct 2026",
    progress: 54,
    risk: "High",
    voyage: "South Africa → India",
    speed: "10.1 kn",
    position: [11.1, 64.2],
    originCoords: [-28.78, 32.04],
    destinationCoords: [22.74, 69.72],
    route: [
      [-28.78, 32.04],
      [-18.0, 42.0],
      [-3.0, 55.0],
      [11.1, 64.2],
      [18.0, 68.0],
      [22.74, 69.72],
    ],
  },
];

const statusStyles = {
  "At Sea": "bg-[#edf7ff] text-[#1687d0] ring-[#b9def7]",
  Loading: "bg-[#fff9e9] text-[#d88a00] ring-[#f4d98d]",
  Available: "bg-[#edfff8] text-[#0b9b72] ring-[#b8efd9]",
  Delayed: "bg-[#fff0f0] text-[#d94b4b] ring-[#f3c2c2]",
};

function VesselTracking() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVessel, setSelectedVessel] = useState(vessels[0]);
  const [now, setNow] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const etaInfo = useMemo(() => {
    const eta = new Date(`${selectedVessel.eta} 08:00`);
    const diffMs = Math.max(0, eta.getTime() - now.getTime());
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const countdown = `${days}d ${hours}h ${minutes}m`;
    const planned = new Date(`${selectedVessel.eta} 06:00`);
    const delayHours = Math.max(
      0,
      (eta.getTime() - planned.getTime()) / 3600000
    );
    const risk = selectedVessel.risk;
    return {
      eta,
      countdown,
      delayHours,
      risk,
      progress: selectedVessel.progress,
    };
  }, [selectedVessel, now]);

  const formatDateTime = (date) =>
    date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredVessels = useMemo(() => vessels.filter((vessel) => {
    const query = search.toLowerCase();
    const matchesSearch =
      vessel.name.toLowerCase().includes(query) ||
      vessel.currentLocation.toLowerCase().includes(query) ||
      vessel.destination.toLowerCase().includes(query) ||
      vessel.cargo.toLowerCase().includes(query);

    return matchesSearch && (statusFilter === "All" || vessel.status === statusFilter);
  }), [search, statusFilter]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [8, 92],
      zoom: 4,
      minZoom: 3,
      maxZoom: 10,
      zoomControl: true,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapInstance.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredVessels.forEach((vessel) => {
      const isSelected = selectedVessel.name === vessel.name;
      const vesselColor =
        vessel.status === "Delayed" ? "#dc4d4d" :
        vessel.status === "Available" ? "#0b9b72" :
        "#1687d0";

      const icon = L.divIcon({
        className: "saylvi-vessel-icon",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="
              width:${isSelected ? 38 : 31}px;height:${isSelected ? 38 : 31}px;
              border-radius:50%;background:${vesselColor};border:${isSelected ? "3px solid white" : "2px solid white"};
              box-shadow:0 3px 12px rgba(15,55,90,.28);
              display:flex;align-items:center;justify-content:center;
              transform:rotate(-10deg);font-size:${isSelected ? 18 : 15}px;
            ">🚢</div>
            <span style="
              white-space:nowrap;background:white;border:1px solid #d9e7f2;border-radius:6px;
              padding:3px 6px;font:700 ${isSelected ? 11 : 10}px Inter,Arial,sans-serif;
              color:#244e76;box-shadow:0 2px 7px rgba(20,60,95,.12)
            ">${vessel.name}</span>
          </div>
        `,
        iconSize: [150, 75],
        iconAnchor: [75, 22],
      });

      const marker = L.marker(vessel.position, { icon }).addTo(layer);
      marker.on("click", () => setSelectedVessel(vessel));

      L.polyline(vessel.route, {
        color: isSelected ? vesselColor : "#7fb7d8",
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.9 : 0.45,
        dashArray: isSelected ? null : "7 8",
      }).addTo(layer);

      L.circleMarker(vessel.position, {
        radius: isSelected ? 9 : 5,
        color: "white",
        weight: 2,
        fillColor: vesselColor,
        fillOpacity: 0.35,
      }).addTo(layer);
    });

    const selectedVisible = filteredVessels.some((v) => v.name === selectedVessel.name);
    if (!selectedVisible && filteredVessels[0]) setSelectedVessel(filteredVessels[0]);
  }, [filteredVessels, selectedVessel]);

  const focusVessel = (vessel) => {
    setSelectedVessel(vessel);
    mapInstance.current?.flyTo(vessel.position, 6.2, { duration: 1.1 });
  };

  const focusRoute = () => {
    const map = mapInstance.current;
    if (!map) return;
    map.fitBounds(selectedVessel.route, { padding: [45, 45], duration: 1 });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4f8fc] p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2b9bda]">
              <FiNavigation /> Fleet Visibility
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#173f6f]">Vessel Tracking</h1>
            <p className="mt-1.5 text-sm text-[#6685a1]">Track every active shipment from origin to destination on a real-world map.</p>
          </div>
          <button onClick={() => navigate("/vessel-match")} className="inline-flex items-center gap-2 self-start rounded-xl border border-[#d8e5ef] bg-white px-4 py-2.5 text-sm font-bold text-[#426581] shadow-sm hover:bg-[#f8fbfe] lg:self-auto">
            <FiArrowLeft /> Vessel Match
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Vessels tracked", vessels.length, FiAnchor],
            ["At sea", vessels.filter(v => v.status === "At Sea").length, FiNavigation],
            ["Available", vessels.filter(v => v.status === "Available").length, FiCheckCircle],
            ["Attention", vessels.filter(v => v.status === "Delayed" || v.risk === "High").length, FiAlertTriangle],
          ].map(([label, value, Icon]) => (
            <div key={label} className="sf-card flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf7ff] text-[#188fd6]"><Icon size={17} /></div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#88a1b6]">{label}</p><p className="mt-0.5 text-xl font-extrabold text-[#214c74]">{value}</p></div>
            </div>
          ))}
        </div>

        <div className="mb-5 sf-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa4b9]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vessel, cargo, location or destination..." className="w-full rounded-xl border border-[#dce8f1] bg-[#fbfdff] py-2.5 pl-10 pr-4 text-sm text-[#315a7d] outline-none focus:border-[#54b6e8] focus:ring-2 focus:ring-[#dff3ff]" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <FiFilter className="shrink-0 text-[#7895ad]" />
              {["All", "At Sea", "Loading", "Available", "Delayed"].map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${statusFilter === status ? "bg-[#e8f5ff] text-[#1765a3] ring-1 ring-[#bfe4f8]" : "text-[#6986a0] hover:bg-[#f4f9fd]"}`}>{status}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[330px_minmax(0,1fr)_330px]">
          <aside className="sf-card overflow-hidden">
            <div className="border-b border-[#e7eff5] p-4">
              <div className="flex items-center justify-between">
                <div><h2 className="text-sm font-extrabold text-[#244e76]">Fleet</h2><p className="mt-1 text-xs text-[#7b95aa]">{filteredVessels.length} vessels visible</p></div>
                <span className="rounded-full bg-[#eafff7] px-2.5 py-1 text-[10px] font-extrabold text-[#0b9b72]">LIVE-READY</span>
              </div>
            </div>
            <div className="max-h-[620px] overflow-y-auto p-2 sf-scrollbar">
              {filteredVessels.map((vessel) => (
                <button key={vessel.name} onClick={() => focusVessel(vessel)} className={`mb-1 w-full rounded-xl p-3 text-left transition ${selectedVessel.name === vessel.name ? "bg-[#e9f6ff] ring-1 ring-[#b9def7]" : "hover:bg-[#f7fbfe]"}`}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">🚢</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2"><p className="truncate text-xs font-extrabold text-[#244e76]">{vessel.name}</p><span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold ${statusStyles[vessel.status]}`}>{vessel.status}</span></div>
                      <p className="mt-1 text-[10px] text-[#7792a9]">{vessel.origin} → {vessel.destination}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-[#7a96ad]"><span>{vessel.cargo}</span><span>ETA {vessel.eta.split(" ")[0]} {vessel.eta.split(" ")[1]}</span></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="sf-card overflow-hidden p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <div><h2 className="text-sm font-extrabold text-[#244e76]">Live fleet map</h2><p className="mt-1 text-[11px] text-[#7b95aa]">Real-world OpenStreetMap view • simulated AIS positions</p></div>
              <button onClick={focusRoute} className="inline-flex items-center gap-1.5 rounded-lg bg-[#edf7ff] px-3 py-2 text-[10px] font-extrabold text-[#1768a8] hover:bg-[#e2f2fc]"><FiCrosshair size={13} /> Focus selected route</button>
            </div>
            <div ref={mapRef} className="h-[560px] overflow-hidden rounded-xl border border-[#dbe8f1]" />
            <div className="mt-3 flex flex-wrap items-center gap-4 px-1 text-[10px] font-semibold text-[#6e89a1]">
              <span><b className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#1687d0]" />At sea</span>
              <span><b className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#0b9b72]" />Available</span>
              <span><b className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#dc4d4d]" />Delayed</span>
              <span className="ml-auto">© OpenStreetMap contributors</span>
            </div>
          </section>

          <aside className="sf-card p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2b9bda]">Selected shipment</p><h2 className="mt-1.5 text-xl font-extrabold text-[#244e76]">{selectedVessel.name}</h2></div>
              <span className="text-2xl">🚢</span>
            </div>
            <p className="mt-1 text-[11px] text-[#7893aa]">{selectedVessel.imo} • {selectedVessel.type} • {selectedVessel.capacity}</p>

            <div className="mt-5 rounded-xl bg-[#f5faff] p-4">
              <div className="flex items-center gap-2"><FiMapPin className="text-[#198bcf]" size={15} /><p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa1b6]">Current position</p></div>
              <p className="mt-1 text-sm font-extrabold text-[#244e76]">{selectedVessel.currentLocation}</p>
              <p className="mt-1 text-[10px] text-[#7893aa]">Speed {selectedVessel.speed}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Info label="Origin" value={selectedVessel.origin} />
              <Info label="Destination" value={selectedVessel.destination} />
              <Info label="ETA" value={selectedVessel.eta} />
              <Info label="Cargo" value={selectedVessel.cargo} />
            </div>

            <div className="mt-5 border-t border-[#e7eff5] pt-5">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-[#6e89a1]">Shipment progress</span><span className="text-xs font-extrabold text-[#244e76]">{selectedVessel.progress}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce9f2]"><div className="h-full rounded-full bg-[#25acd9]" style={{ width: `${selectedVessel.progress}%` }} /></div>
            </div>

            <div className={`mt-5 flex items-center justify-between rounded-xl p-3 ${selectedVessel.status === "Delayed" ? "bg-[#fff3f3]" : "bg-[#edfff8]"}`}>
              <div className="flex items-center gap-2">{selectedVessel.status === "Delayed" ? <FiAlertTriangle className="text-[#d94b4b]" size={16} /> : <FiCheckCircle className="text-[#0b9b72]" size={16} />}<span className="text-xs font-extrabold text-[#426581]">{selectedVessel.status}</span></div>
              <span className={`text-[10px] font-extrabold ${selectedVessel.risk === "High" ? "text-[#d94b4b]" : selectedVessel.risk === "Medium" ? "text-[#d88a00]" : "text-[#0b9b72]"}`}>{selectedVessel.risk} risk</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#e7eff5] p-3"><FiActivity className="text-[#198bcf]" size={15} /><p className="mt-2 text-[10px] text-[#829bb0]">Voyage</p><p className="text-xs font-extrabold text-[#315a7d]">{selectedVessel.voyage}</p></div>
              <div className="rounded-xl border border-[#e7eff5] p-3"><FiPackage className="text-[#198bcf]" size={15} /><p className="mt-2 text-[10px] text-[#829bb0]">Available</p><p className="text-xs font-extrabold text-[#315a7d]">{selectedVessel.available}</p></div>
            </div>
          </aside>
        </div>

        <section className="mt-5 sf-card overflow-hidden">
          <div className="border-b border-[#e7eff5] bg-[#f8fbfe] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2b9bda]">Time intelligence</p>
                <h2 className="mt-1 text-base font-extrabold text-[#244e76]">ETA & voyage timing</h2>
                <p className="mt-1 text-xs text-[#7893aa]">Live countdown and arrival-window intelligence for the selected vessel.</p>
              </div>
              <span className="rounded-full bg-[#e9f8ff] px-3 py-1 text-[10px] font-extrabold text-[#1687d0]">UPDATES LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#e4eef5] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa1b6]">Current time</p>
              <p className="mt-2 text-xl font-extrabold text-[#244e76]">{formatTime(now)}</p>
              <p className="mt-1 text-[10px] text-[#7893aa]">Local system time</p>
            </div>

            <div className="rounded-xl border border-[#e4eef5] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa1b6]">ETA countdown</p>
              <p className="mt-2 text-xl font-extrabold text-[#1687d0]">{etaInfo.countdown}</p>
              <p className="mt-1 text-[10px] text-[#7893aa]">Time remaining</p>
            </div>

            <div className="rounded-xl border border-[#e4eef5] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa1b6]">Estimated arrival</p>
              <p className="mt-2 text-lg font-extrabold text-[#244e76]">{formatDateTime(etaInfo.eta)}</p>
              <p className="mt-1 text-[10px] text-[#7893aa]">Target window: 06:00–12:00</p>
            </div>

            <div className={`rounded-xl border p-4 ${etaInfo.risk === "High" ? "border-[#ffd5d5] bg-[#fff6f6]" : etaInfo.risk === "Medium" ? "border-[#ffe4b5] bg-[#fffaf0]" : "border-[#d8f2e8] bg-[#f4fffa]"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa1b6]">Delay risk</p>
              <p className={`mt-2 text-xl font-extrabold ${etaInfo.risk === "High" ? "text-[#d94b4b]" : etaInfo.risk === "Medium" ? "text-[#d88a00]" : "text-[#0b9b72]"}`}>{etaInfo.risk}</p>
              <p className="mt-1 text-[10px] text-[#7893aa]">ETA confidence: {etaInfo.risk === "High" ? "Low" : etaInfo.risk === "Medium" ? "Medium" : "High"}</p>
            </div>
          </div>

          <div className="px-5 pb-5">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#7893aa]">
              <span>Voyage progress</span>
              <span className="text-[#244e76]">{etaInfo.progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce9f2]">
              <div className="h-full rounded-full bg-[#25acd9] transition-all duration-500" style={{ width: `${etaInfo.progress}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-[#7893aa]">
              <span>🛰️ Last AIS update: <b className="text-[#315a7d]">4 min ago</b></span>
              <span>🕐 Planned arrival: <b className="text-[#315a7d]">{selectedVessel.eta} 06:00</b></span>
              <span>{etaInfo.risk === "High" ? "⚠️ Arrival window at risk" : "✓ Within expected arrival window"}</span>
            </div>
          </div>
        </section>

        <div className="mt-5 sf-card overflow-hidden">
          <div className="border-b border-[#e7eff5] p-5"><h2 className="text-sm font-extrabold text-[#244e76]">Fleet movement overview</h2><p className="mt-1 text-xs text-[#7893aa]">Select any vessel to focus its shipment route on the map.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#f8fbfe] text-[10px] uppercase tracking-wider text-[#8ba3b9]"><tr><th className="px-5 py-3">Vessel</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Shipment</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">ETA</th><th className="px-5 py-3">Risk</th></tr></thead>
              <tbody className="divide-y divide-[#edf2f7]">
                {filteredVessels.map((vessel) => (
                  <tr key={vessel.name} onClick={() => focusVessel(vessel)} className="cursor-pointer hover:bg-[#f8fbfe]">
                    <td className="px-5 py-3.5"><p className="text-xs font-extrabold text-[#234d75]">{vessel.name}</p><p className="mt-0.5 text-[10px] text-[#7892aa]">{vessel.type} • {vessel.capacity}</p></td>
                    <td className="px-5 py-3.5 text-xs text-[#526f8b]">{vessel.currentLocation}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-[#526f8b]">{vessel.origin} → {vessel.destination}</td>
                    <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${statusStyles[vessel.status]}`}>{vessel.status}</span></td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-[#526f8b]">{vessel.eta}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-[#526f8b]">{vessel.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-[#91a6ba]">Prototype tracking uses simulated AIS positions. The OpenStreetMap base layer is real-world map data; live vessel positions can later be supplied by SAYLVI's backend/AIS integration.</p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div><p className="text-[10px] uppercase tracking-wider text-[#8aa1b6]">{label}</p><p className="mt-1 text-xs font-extrabold text-[#315a7d]">{value}</p></div>;
}


export default VesselTracking;

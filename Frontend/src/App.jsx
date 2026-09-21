import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import Forecast from "./pages/Forecast";
import VesselMatch from "./pages/VesselMatch";
import VesselTracking from "./pages/VesselTracking";
import CostComparison from "./pages/CostComparison";
import Decision from "./pages/Decision";
import WhatIf from "./pages/WhatIf";
import Reports from "./pages/Reports";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="min-h-screen ml-64">
          <Header />

          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new-analysis" element={<NewAnalysis />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/vessel-match" element={<VesselMatch />} />
              <Route path="/vessel-tracking" element={<VesselTracking />} />
              <Route path="/cost-comparison" element={<CostComparison />} />
              <Route path="/decision" element={<Decision />} />
              <Route path="/what-if" element={<WhatIf />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
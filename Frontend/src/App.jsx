import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import Forecast from "./pages/Forecast";
import VesselMatch from "./pages/VesselMatch";
import VesselTracking from "./pages/VesselTracking";
import CostComparison from "./pages/CostComparison";
import Decision from "./pages/Decision";
import WhatIf from "./pages/WhatIf";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen app-shell">
        <Sidebar />
        <Header />
        <main className="pt-20 lg:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis/new" element={<NewAnalysis />} />
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
    </BrowserRouter>
  );
}

export default App;

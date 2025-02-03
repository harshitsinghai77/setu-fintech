import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Navbar from "./components/Navbar";
import Onboarding from "./views/Onboarding";
import MockPayment from "./views/MockPayment";
import Analytics from "./views/Analytics";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <main>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/mock-payment/:trackId?" element={<MockPayment />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

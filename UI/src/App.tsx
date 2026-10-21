import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Company from "./pages/Company/Company";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/company/:symbol" element={<Company />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
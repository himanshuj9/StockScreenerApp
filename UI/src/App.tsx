import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Company from "./pages/Company/Company";
import StockChatbot from "./components/StockChatbot/StockChatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:symbol" element={<Company />} />
      </Routes>
      <StockChatbot />
    </BrowserRouter>
  );
}

export default App;

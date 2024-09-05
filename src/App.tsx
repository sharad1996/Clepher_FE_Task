import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StockData from "./pages/StockData";
import StockList from "./pages/StockList";
import PageNotFound from "./pages/PageNotFound";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 text-white">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/stock-list">Stock List</a>
            </li>
          </ul>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock-list" element={<StockList />} />
            <Route path="/stock-data/:symbol" element={<StockData />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import './App.css'; // Ensure to import the CSS file

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="container">
        <nav className="nav-buttons">
          <button className="nav-button">
            <Link to="/inventory" className="nav-link">Inventory</Link>
          </button>
          <button className="nav-button">
            <Link to="/customers" className="nav-link">Customers</Link>
          </button>
        </nav>
        <Routes>
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/customers" element={<Customers/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

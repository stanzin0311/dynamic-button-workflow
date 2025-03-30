// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ConfigPage from './ConfigPage';
import OutputPage from './OutputPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/config">Config</Link> | <Link to="/output">Output</Link>
        </nav>
        <Routes>
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/output" element={<OutputPage />} />
          <Route path="/" element={<ConfigPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
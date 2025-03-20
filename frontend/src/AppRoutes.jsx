// AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ModelTesting from './ModelTesting';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/model_testing" element={<ModelTesting />} />
      </Routes>
    </BrowserRouter>
  );
}

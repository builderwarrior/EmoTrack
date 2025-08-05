import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import VisualDetectionPage from '../pages/VisualDetection/VisualDetectionPage';
import TextAnalysisPage from '../pages/TextAnalysis/TextAnalysisPage';
import TrendsPage from '../pages/Trends/TrendsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/visual-detection" element={<VisualDetectionPage />} />
      <Route path="/text-analysis" element={<TextAnalysisPage />} />
      <Route path="/trends" element={<TrendsPage />} />
    </Routes>
  );
};

export default AppRoutes;
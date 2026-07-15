import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './pages/DashboardLayout';
import SearchCustomersPage from './pages/SearchCustomersPage';
import TakeQuestionsPage from './pages/TakeQuestionsPage';
import QuizResultsPage from './pages/QuizResultsPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/search-customers" replace />} />
          <Route path="search-customers" element={<SearchCustomersPage />} />
          <Route path="take-questions" element={<TakeQuestionsPage />} />
          <Route path="quiz-results" element={<QuizResultsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        
        {/* Redirect any other unknown routes to login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


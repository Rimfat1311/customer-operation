import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './pages/DashboardLayout';
import SearchCustomersPage from './pages/SearchCustomersPage';
import TakeQuestionsPage from './pages/TakeQuestionsPage';
import QuizResultsPage from './pages/QuizResultsPage';
import NotificationsPage from './pages/NotificationsPage';
import ComposeNotificationPage from './pages/ComposeNotificationPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Dashboard Layout Routing */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/search-customers" replace />} />
          <Route path="search-customers" element={<SearchCustomersPage />} />
          <Route path="take-questions" element={<TakeQuestionsPage />} />
          <Route path="quiz-results" element={<QuizResultsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="compose-notification" element={<ComposeNotificationPage />} />
        </Route>
        
        {/* Redirect any other unknown routes to login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


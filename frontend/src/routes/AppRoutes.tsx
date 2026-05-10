import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import PlanTripPage from "../pages/PlanTripPage";
import ItineraryBuilderPage from "../pages/ItineraryBuilderPage";
import ItineraryViewPage from "../pages/ItineraryViewPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/plan" element={<ProtectedRoute><PlanTripPage /></ProtectedRoute>} />
      <Route path="/itinerary" element={<ProtectedRoute><ItineraryBuilderPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

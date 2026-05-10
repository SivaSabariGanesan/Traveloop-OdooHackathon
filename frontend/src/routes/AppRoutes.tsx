import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import PlanTripPage from "../pages/PlanTripPage";
import ItineraryBuilderPage from "../pages/ItineraryBuilderPage";
import ProfilePage from "../pages/ProfilePage";
import TripsPage from "../pages/TripsPage";
import CommunityPage from "../pages/CommunityPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/plan" element={<PlanTripPage />} />
      <Route path="/itinerary" element={<ItineraryBuilderPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/trips" element={<TripsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

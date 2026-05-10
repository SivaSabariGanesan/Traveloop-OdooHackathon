import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import LandingPage from "../pages/LandingPage";
import PlanTripPage from "../pages/PlanTripPage";
import ItineraryBuilderPage from "../pages/ItineraryBuilderPage";
import ProfilePage from "../pages/ProfilePage";
import TripsPage from "../pages/TripsPage";
import SharedTripPage from "../pages/SharedTripPage";
import NotesPage from "../pages/NotesPage";
import ChecklistPage from "../pages/ChecklistPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import InvoicePage from "../pages/InvoicePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/plan" element={<PlanTripPage />} />
      <Route path="/itinerary" element={<ItineraryBuilderPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/trips" element={<TripsPage />} />
      <Route path="/trip/:id" element={<SharedTripPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/checklist" element={<ChecklistPage />} />
      <Route path="/invoice" element={<InvoicePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

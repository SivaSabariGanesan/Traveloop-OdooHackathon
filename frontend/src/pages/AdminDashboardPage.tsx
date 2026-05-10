import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi, type AdminStats, type AdminUser } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  useEffect(() => {
    // If not admin, redirect or show error
    if (!user) return;
    if (user.role !== "ADMIN") {
      setError("You do not have permission to view the Admin Dashboard.");
      setLoading(false);
      return;
    }

    Promise.all([
      adminApi.getDashboardStats().then(r => setStats(r.data.data)),
      adminApi.getUsers().then(r => setUsers(r.data.data)),
    ])
    .catch(() => setError("Failed to load admin data."))
    .finally(() => setLoading(false));
  }, [user]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert("Failed to update user role.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg text-text dark:text-dark-text p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-text dark:text-dark-text transition-colors duration-300">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-secondary dark:border-dark-border bg-background/80 dark:bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/"><img src="/Traveloop.png" alt="Traveloop" className="h-8 object-contain" /></Link>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded ml-2">Admin Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/profile" className="w-9 h-9 rounded-full bg-secondary dark:bg-dark-border flex items-center justify-center hover:opacity-80 transition">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Platform Analytics</h1>
          <div className="flex bg-card dark:bg-dark-card p-1 rounded-lg border border-secondary dark:border-dark-border self-start inline-flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-background dark:bg-dark-bg shadow-sm text-primary" : "text-text/60 dark:text-dark-text/60 hover:text-text dark:hover:text-dark-text"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "users" ? "bg-background dark:bg-dark-bg shadow-sm text-primary" : "text-text/60 dark:text-dark-text/60 hover:text-text dark:hover:text-dark-text"}`}
            >
              Manage Users
            </button>
          </div>
        </div>

        {activeTab === "overview" && stats && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Total Users" value={stats.totalUsers} icon={<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
              <MetricCard title="Total Trips Planned" value={stats.totalTrips} icon={<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <MetricCard title="Cities Explored" value={stats.topCities.length} icon={<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
              <MetricCard title="Recent Signups" value={stats.recentUsers.filter(u => new Date(u.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length} subtitle="in last 7 days" icon={<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Destinations Chart */}
              <div className="bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Most Popular Destinations</h3>
                {stats.topCities.length > 0 ? (
                  <div className="space-y-5">
                    {stats.topCities.map((city, idx) => {
                      const max = Math.max(...stats.topCities.map(c => c.visits));
                      const pct = Math.round((city.visits / max) * 100);
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{city.city}</span>
                            <span className="text-text/60 dark:text-dark-text/60">{city.visits} stops</span>
                          </div>
                          <div className="w-full bg-secondary/50 dark:bg-dark-border h-2.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text/50">No destinations visited yet.</p>
                )}
              </div>

              {/* Trips by Status */}
              <div className="bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Trip Status Breakdown</h3>
                {stats.tripsByStatus.length > 0 ? (
                  <div className="space-y-5">
                    {stats.tripsByStatus.map((status, idx) => {
                      const max = stats.totalTrips;
                      const pct = Math.round((status.count / max) * 100);
                      const colorClass = status.status === "ONGOING" ? "bg-green-500" : status.status === "UPCOMING" ? "bg-blue-500" : "bg-gray-500";
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium capitalize">{status.status.toLowerCase()}</span>
                            <span className="text-text/60 dark:text-dark-text/60">{status.count} trips ({pct}%)</span>
                          </div>
                          <div className="w-full bg-secondary/50 dark:bg-dark-border h-2.5 rounded-full overflow-hidden">
                            <div className={`${colorClass} h-full rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text/50">No trips created yet.</p>
                )}
              </div>
            </div>
            
            {/* Recent Trips Table */}
            <div className="bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-secondary dark:border-dark-border">
                <h3 className="text-lg font-semibold">Latest Trips Planned</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/30 dark:bg-dark-border/30 text-text/70 dark:text-dark-text/70">
                    <tr>
                      <th className="px-6 py-3 font-medium">Trip Name</th>
                      <th className="px-6 py-3 font-medium">Destination</th>
                      <th className="px-6 py-3 font-medium">Creator</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/50 dark:divide-dark-border/50">
                    {stats.recentTrips.map(trip => (
                      <tr key={trip.id} className="hover:bg-secondary/10 dark:hover:bg-dark-border/10">
                        <td className="px-6 py-4 font-medium">{trip.name}</td>
                        <td className="px-6 py-4">{trip.destination || "Multiple"}</td>
                        <td className="px-6 py-4 text-text/70 dark:text-dark-text/70">{trip.user.firstName} {trip.user.lastName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${trip.status === "ONGOING" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : trip.status === "UPCOMING" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text/70 dark:text-dark-text/70">{formatDate(trip.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-secondary dark:border-dark-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <span className="text-sm bg-background dark:bg-dark-bg px-3 py-1 rounded-md border border-secondary dark:border-dark-border">
                {users.length} Total Users
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/30 dark:bg-dark-border/30 text-text/70 dark:text-dark-text/70">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium">Trips Planned</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/50 dark:divide-dark-border/50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-secondary/10 dark:hover:bg-dark-border/10">
                      <td className="px-6 py-4 font-medium">{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-4 text-text/70 dark:text-dark-text/70">{u.email}</td>
                      <td className="px-6 py-4 text-text/70 dark:text-dark-text/70">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4">{u._count.trips}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "ADMIN" ? "bg-primary/20 text-primary dark:text-primary" : "bg-secondary/50 dark:bg-dark-border text-text/70 dark:text-dark-text/70"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="text-primary hover:underline text-xs font-medium"
                          disabled={user?.id === u.id} // prevent self-demotion
                        >
                          {u.role === "ADMIN" ? "Demote to User" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: number | string; subtitle?: string; icon: React.ReactNode }> = ({ title, value, subtitle, icon }) => (
  <div className="bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-text/70 dark:text-dark-text/70 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-background dark:bg-dark-bg rounded-lg border border-secondary dark:border-dark-border">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-text/50 dark:text-dark-text/50 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default AdminDashboardPage;

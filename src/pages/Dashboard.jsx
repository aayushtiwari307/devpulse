import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import useSocket from "../hooks/useSocket";

import LiveFeed from "../components/LiveFeed";
import CommitHeatmap from "../components/CommitHeatmap";
import PRVelocity from "../components/PRVelocity";
import LanguageBreakdown from "../components/LanguageBreakdown";
import Navbar from "../components/Navbar";

const SkeletonCard = () => (
  <div className="card">
    <div
      className="skeleton skeleton-text"
      style={{
        width: "35%",
        marginBottom: 10,
      }}
    />

    <div className="skeleton skeleton-chart" />
  </div>
);

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const timer = window.setTimeout(() => {
      setDataLoading(true);
      setError(null);

      Promise.all([
        api.get("/api/events"),
        api.get("/api/events/stats"),
      ])
        .then(([eventsRes, statsRes]) => {
          if (!isCancelled) {
            setEvents(eventsRes.data.events || []);
            setStats(statsRes.data);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setError(
              "Failed to load dashboard data. Please refresh."
            );
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setDataLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [user]);

  useSocket(user?.githubId, (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  });

  if (authLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>Loading DevPulse…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const totalCommits =
    stats?.commitsByDay?.reduce(
      (sum, day) => sum + day.count,
      0
    ) || 0;

  return (
    <div className="dashboard">
      <Navbar />

      <header className="dashboard-header">
        <h2>Activity Dashboard</h2>

        <span>@{user.username}</span>
      </header>

      {error && (
        <div>
          <div className="error-state">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="dashboard-grid">
        {dataLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Commit Activity */}
            <section className="card">
              <div className="card-header">
                <span className="card-title">
                  Commit Activity
                </span>

                {totalCommits > 0 && (
                  <span className="card-badge">
                    {totalCommits} commits
                  </span>
                )}
              </div>

              <CommitHeatmap
                data={stats?.commitsByDay || []}
              />
            </section>

            {/* PR Velocity */}
            <section className="card">
              <div className="card-header">
                <span className="card-title">
                  PR Velocity
                </span>
              </div>

              <PRVelocity
                data={stats?.eventsByType || []}
              />
            </section>

            {/* Events Breakdown */}
            <section className="card">
              <div className="card-header">
                <span className="card-title">
                  Events Breakdown
                </span>
              </div>

              <LanguageBreakdown
                data={stats?.eventsByType || []}
              />
            </section>

            {/* Live Feed */}
            <section className="card">
              <div className="card-header">
                <span className="card-title">
                  Live Feed
                </span>

                <div className="live-indicator">
                  <span className="live-dot" />
                  LIVE
                </div>
              </div>

              <LiveFeed events={events} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { auth, googleProvider, db } from "./firebase";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "28px 16px",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: 1100,
    margin: "auto",
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 3px 14px rgba(0,0,0,0.05)",
  },

  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#263b80",
    color: "white",
    fontSize: 14,
  },
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "Not available";

  return timestamp.toDate().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getDistribution(profiles, field, labels) {
  const counts = {};

  profiles.forEach((profile) => {
    const value = profile.answers?.[field] || "unknown";

    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts).map(([value, count]) => ({
    name: labels[value] || value,
    count,
  }));
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [escalations, setEscalations] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login() {
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      setError("Login failed. Please try again.");
    }
  }

  async function loadDashboard() {
    setDataLoading(true);
    setError("");

    try {
      const [profileSnapshot, escalationSnapshot] =
        await Promise.all([
          getDocs(collection(db, "profiles")),
          getDocs(collection(db, "escalations")),
        ]);

      const profileData = profileSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const escalationData = escalationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      profileData.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      escalationData.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setProfiles(profileData);
      setEscalations(escalationData);

    } catch (e) {
      console.error(e);

      setError(
        "Could not load dashboard data. Check Firestore rules and admin email."
      );

    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const educationData = getDistribution(profiles, "education", {
    "8th_or_below": "8th or below",
    "10th": "10th",
    "12th": "12th",
    graduate: "Graduate",
  });

  const occupationData = getDistribution(profiles, "work", {
    farming: "Farming",
    shop: "Shop",
    none: "Not working",
  });

  const preferenceData = getDistribution(profiles, "preference", {
    job: "Job",
    own: "Self-employment",
  });

  if (loading) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1>Disha Admin Dashboard</h1>

            <p style={{ color: "#64748b" }}>
              Livelihood Interview Management
            </p>
          </div>

          <a href="#" style={{ color: "#263b80" }}>
            ← Back to app
          </a>
        </div>

        {/* LOGIN */}

        {!user ? (
          <div
            style={{
              ...styles.card,
              textAlign: "center",
            }}
          >
            <h2>Admin Login</h2>

            <p>
              Sign in with your authorized Google account.
            </p>

            <button
              style={styles.button}
              onClick={login}
            >
              Sign in with Google
            </button>

            {error && (
              <p style={{ color: "red" }}>{error}</p>
            )}
          </div>
        ) : (
          <>
            {/* ADMIN ACCOUNT */}

            <div
              style={{
                ...styles.card,
                marginTop: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <strong>Admin account</strong>

                <p style={{ color: "#64748b" }}>
                  {user.email}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={styles.button}
                  onClick={loadDashboard}
                  disabled={dataLoading}
                >
                  {dataLoading ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  style={{
                    ...styles.button,
                    background: "#dc2626",
                  }}
                  onClick={() => signOut(auth)}
                >
                  Sign out
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  ...styles.card,
                  marginTop: 18,
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {dataLoading ? (
              <p style={{ marginTop: 25 }}>
                Loading dashboard data...
              </p>
            ) : (
              <>
                {/* STATISTICS */}

                <h2 style={{ marginTop: 30 }}>
                  Overview
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      title: "Total Interviews",
                      value: profiles.length,
                    },
                    {
                      title: "Callback Requests",
                      value: escalations.length,
                    },
                    {
                      title: "English Interviews",
                      value: profiles.filter(
                        (p) => p.language === "en"
                      ).length,
                    },
                    {
                      title: "Hindi Interviews",
                      value: profiles.filter(
                        (p) => p.language === "hi"
                      ).length,
                    },
                    {
                      title: "Marathi Interviews",
                      value: profiles.filter(
                        (p) => p.language === "mr"
                      ).length,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={styles.card}
                    >
                      <p style={{ color: "#64748b" }}>
                        {item.title}
                      </p>

                      <h1>{item.value}</h1>
                    </div>
                  ))}
                </div>

                {/* ANALYTICS */}

                <h2 style={{ marginTop: 30 }}>
                  Analytics & Insights
                </h2>

                {[
                  {
                    title: "Education Distribution",
                    data: educationData,
                  },
                  {
                    title: "Current Occupation",
                    data: occupationData,
                  },
                  {
                    title: "Career Preference",
                    data: preferenceData,
                  },
                ].map((chart) => (
                  <div
                    key={chart.title}
                    style={{
                      ...styles.card,
                      marginBottom: 20,
                    }}
                  >
                    <h3>{chart.title}</h3>

                    {chart.data.length === 0 ? (
                      <p>No data available yet.</p>
                    ) : (
                      <ResponsiveContainer
                        width="100%"
                        height={250}
                      >
                        <BarChart data={chart.data}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis dataKey="name" />

                          <YAxis allowDecimals={false} />

                          <Tooltip />

                          <Bar
                            dataKey="count"
                            fill="#263b80"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                ))}

                {/* RECENT INTERVIEWS */}

                <div
                  style={{
                    ...styles.card,
                    marginTop: 24,
                  }}
                >
                  <h2>Recent Interviews</h2>

                  {profiles.length === 0 ? (
                    <p>No interviews found yet.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          textAlign: "left",
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ padding: 10 }}>
                              Language
                            </th>

                            <th style={{ padding: 10 }}>
                              Answers
                            </th>

                            <th style={{ padding: 10 }}>
                              Date
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {profiles.slice(0, 20).map((profile) => (
                            <tr key={profile.id}>
                              <td style={{ padding: 10 }}>
                                {profile.language || "N/A"}
                              </td>

                              <td style={{ padding: 10 }}>
                                <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    minWidth: 180,
                                  }}
                                >
                                  {JSON.stringify(
                                    profile.answers,
                                    null,
                                    2
                                  )}
                                </pre>
                              </td>

                              <td style={{ padding: 10 }}>
                                {formatDate(profile.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* CALLBACK REQUESTS */}

                <div
                  style={{
                    ...styles.card,
                    marginTop: 24,
                  }}
                >
                  <h2>Counsellor Callback Requests</h2>

                  {escalations.length === 0 ? (
                    <p>No callback requests found yet.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          textAlign: "left",
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ padding: 10 }}>
                              Mobile Number
                            </th>

                            <th style={{ padding: 10 }}>
                              Language
                            </th>

                            <th style={{ padding: 10 }}>
                              Status
                            </th>

                            <th style={{ padding: 10 }}>
                              Date
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {escalations.map((request) => (
                            <tr key={request.id}>
                              <td style={{ padding: 10 }}>
                                {request.phone}
                              </td>

                              <td style={{ padding: 10 }}>
                                {request.language}
                              </td>

                              <td style={{ padding: 10 }}>
                                {request.status || "new"}
                              </td>

                              <td style={{ padding: 10 }}>
                                {formatDate(request.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* FOOTER */}

        <p
          style={{
            textAlign: "center",
            marginTop: 30,
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Disha — Voice-First Livelihood Assistant
        </p>

      </div>
    </div>
  );
}

import { serverAxios } from "@/lib/axios/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const ax = await serverAxios();

  const [assetsRes, supervisorsRes] = await Promise.all([
    ax.get("/assets/admin"),
    ax.get("/supervisor"),
  ]);

  const assets = assetsRes.data || [];
  const supervisors = supervisorsRes.data || [];

  return (
    <div>
      <h1
        style={{
          fontSize: "22px",
          fontWeight: 800,
          marginBottom: 12,
          color: "#fff",
        }}
      >
        Admin Dashboard
      </h1>

      {/* 🔘 ACTION BUTTONS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link href="/admin/assets" style={btnStyle}>
          Manage Assets
        </Link>

        <Link href="/admin/supervisors" style={btnStyle}>
          View Supervisors
        </Link>

        <Link href="/admin/admins" style={btnStyle}>
          Manage Admins
        </Link>
      </div>

      {/* 📊 STATS */}
      <div style={{ display: "grid", gap: 14 }}>
        <div style={cardStyle}>
          <p style={cardTitle}>Assets in system</p>
          <p style={{ ...cardValue, color: "#0d6efd" }}>
            {assets.length}
          </p>
        </div>

        <div style={cardStyle}>
          <p style={cardTitle}>Supervisors in system</p>
          <p style={{ ...cardValue, color: "#198754" }}>
            {supervisors.length}
          </p>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const btnStyle = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
  color: "#fff",
  borderRadius: 8,
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
};

const cardStyle = {
  background: "#ffffff",
  padding: 16,
  borderRadius: 12,
  color: "#111",
  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
};

const cardTitle = {
  margin: 0,
  fontWeight: 700,
  color: "#333",
};

const cardValue = {
  fontSize: 32,
  marginTop: 6,
  fontWeight: 800,
};

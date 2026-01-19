"use client";

import React, { useEffect, useState } from "react";
import client from "@/lib/axios/client";

type Supervisor = {
  s_id: number;
  s_username: string;
  s_fullname?: string;
};

export default function SupervisorsPage() {
  const [data, setData] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await client.get("/supervisor");
        setData(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load supervisors");
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Loading supervisors...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={pageTitle}>Supervisors</h2>

      <div style={card}>
        {data.length === 0 ? (
          <p>No supervisors found.</p>
        ) : (
          data.map((s) => (
            <div key={s.s_id} style={listItem}>
              <div style={{ fontWeight: 700 }}>
                {s.s_fullname || "N/A"}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>
                @{s.s_username}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const pageTitle = {
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 12,
  color: "#fff",
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  color: "#111",
  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
};

const listItem = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const listItemFlex = {
  ...listItem,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const primaryBtn = {
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#0d6efd",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const linkBtn = {
  fontWeight: 700,
  color: "#0d6efd",
  textDecoration: "none",
};

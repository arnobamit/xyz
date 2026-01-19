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

  if (loading) return <p style={{ padding: 16 }}>Loading supervisors...</p>;
  if (error) return <p style={{ padding: 16, color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
        Supervisors (Admin)
      </h2>

      <div style={{ background: "#fff", borderRadius: 10, padding: 12 }}>
        {data.length === 0 ? (
          <p>No supervisors found.</p>
        ) : (
          data.map((s) => (
            <div
              key={s.s_id}
              style={{
                padding: 10,
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 700 }}>{s.s_fullname || "N/A"}</div>
              <div style={{ fontSize: 13, color: "#666" }}>@{s.s_username}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

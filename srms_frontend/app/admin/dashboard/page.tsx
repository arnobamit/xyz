import { serverAxios } from "@/lib/axios/server";

export default async function AdminDashboardPage() {
  const ax = await serverAxios();

  // Fetch both in parallel (SSR)
  const [assetsRes, supervisorsRes] = await Promise.all([
    ax.get("/assets/admin"),   // admin assets :contentReference[oaicite:1]{index=1}
    ax.get("/supervisor"),     // admin supervisors :contentReference[oaicite:2]{index=2}
  ]);

  const assets = assetsRes.data || [];
  const supervisors = supervisorsRes.data || [];

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>
        Admin Dashboard
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ background: "#fff", padding: 14, borderRadius: 10 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>Assets in system</p>
          <p style={{ fontSize: 28, margin: "6px 0 0 0" }}>{assets.length}</p>
        </div>

        <div style={{ background: "#fff", padding: 14, borderRadius: 10 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>Supervisors in system</p>
          <p style={{ fontSize: 28, margin: "6px 0 0 0" }}>
            {supervisors.length}
          </p>
        </div>
      </div>
    </div>
  );
}

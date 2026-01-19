import Link from "next/link";
import { serverAxios } from "@/lib/axios/server";

export default async function AssetsPage() {
  const ax = await serverAxios();

  const res = await ax.get("/assets/admin");
  const assets = res.data || [];

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>
        Assets (Admin)
      </h2>

      <div
        style={{ background: "#fff", borderRadius: "10px", padding: "12px" }}
      >
        {assets.map((a: any) => (
          <div
            key={a.as_id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{a.as_name}</div>
              <div style={{ fontSize: "13px", color: "#666" }}>
                {a.as_type} • {a.as_status}
              </div>
            </div>

            <Link href={`/admin/assets/${a.as_id}`} style={{ fontWeight: 700 }}>
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

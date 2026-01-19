import { notFound } from "next/navigation";
import { serverAxios } from "@/lib/axios/server";

export default async function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ax = await serverAxios(); // ✅ FIX: await

  try {
    const res = await ax.get(`/assets/a/${params.id}`);
    const asset = res.data;

    return (
      <div style={{ background: "#fff", borderRadius: "10px", padding: "14px" }}>
        <h2 style={{ marginTop: 0 }}>{asset.as_name}</h2>
        <p style={{ margin: 0 }}>Type: {asset.as_type}</p>
        <p style={{ marginTop: "6px" }}>Status: {asset.as_status}</p>
      </div>
    );
  } catch {
    notFound();
  }
}

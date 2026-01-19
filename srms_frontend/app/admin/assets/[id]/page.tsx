import { notFound } from "next/navigation";
import { serverAxios } from "@/lib/axios/server";
import styles from "../../../admin.module.css";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  const { id } = await params; 
  const ax = await serverAxios();

  try {
    const res = await ax.get(`/assets/a/${id}`);
    const asset = res.data;

    return (
      <div>
        <h2 className={styles.pageTitle}>Asset Details</h2>
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>{asset.as_name}</h2>
          <p style={{ margin: 0 }}><strong>Type:</strong> {asset.as_type}</p>
          <p style={{ marginTop: "6px" }}><strong>Status:</strong> {asset.as_status}</p>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
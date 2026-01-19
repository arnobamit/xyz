import Link from "next/link";
import { serverAxios } from "@/lib/axios/server";
import styles from "../../admin.module.css";

export default async function AssetsPage() {
  const ax = await serverAxios();
  const res = await ax.get("/assets/admin");
  const assets = res.data || [];

  return (
    <div>
      <h2 className={styles.pageTitle}>Assets</h2>

      <div className={styles.card}>
        {assets.length === 0 ? (
          <p>No assets found.</p>
        ) : (
          assets.map((a: any) => (
            <div key={a.as_id} className={styles.listItemFlex}>
              <div>
                <div style={{ fontWeight: 800 }}>{a.as_name}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {a.as_type} • {a.as_status}
                </div>
              </div>

              <Link href={`/admin/assets/${a.as_id}`} className={styles.linkBtn}>
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
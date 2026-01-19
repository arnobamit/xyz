"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import client from "@/lib/axios/client";
import Input from "@/components/Input";
import { assetSchema, type AssetInput } from "@/lib/validations/asset";

export default function AssetForm({
  mode,
  assetId,
  onDone,
}: {
  mode: "create" | "update";
  assetId?: number;
  onDone?: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<AssetInput>({ resolver: zodResolver(assetSchema) });

  const onSubmit = async (data: AssetInput) => {
    try {
      if (mode === "create") {
        // Axios #5 -> POST /assets :contentReference[oaicite:16]{index=16}
        await client.post("/assets", data);
        alert("Asset created!");
      } else {
        // Axios #6 -> PUT /assets/:id :contentReference[oaicite:17]{index=17}
        await client.put(`/assets/${assetId}`, data);
        alert("Asset updated!");
      }
      onDone?.();
    } catch (e: any) {
      alert(e.response?.data?.message || "Operation failed");
    }
  };

  const onDelete = async () => {
    try {
      // Axios #7 -> DELETE /assets/:id :contentReference[oaicite:18]{index=18}
      await client.delete(`/assets/${assetId}`);
      alert("Asset deleted!");
      onDone?.();
    } catch (e: any) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ background: "#fff", padding: 14, borderRadius: 10 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Type" type="text" register={register("as_type")} error={errors.as_type?.message} />
        <Input label="Name" type="text" register={register("as_name")} error={errors.as_name?.message} />
        <Input label="Status" type="text" register={register("as_status")} error={errors.as_status?.message} />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Asset" : "Update Asset"}
        </button>
      </form>

      {mode === "update" ? (
        <button
          onClick={onDelete}
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Delete Asset
        </button>
      ) : null}
    </div>
  );
}

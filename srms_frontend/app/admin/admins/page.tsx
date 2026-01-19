"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import client from "@/lib/axios/client";
import Input from "@/components/Input";
import {
  adminCreateSchema,
  type AdminCreateInput,
} from "@/lib/validations/admin";
import styles from "../../admin.module.css";

type Admin = {
  a_id: number;
  a_username: string;
  a_fullname?: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateInput>({
    resolver: zodResolver(adminCreateSchema),
  });

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await client.get("/admin");
    setAdmins(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const onSubmit = async (data: AdminCreateInput) => {
    try {
      await client.post("/admin/register", data);
      reset();
      fetchAdmins();
      alert("Admin created!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Admin Management</h2>

      <div className={styles.card}>
        <h3 style={{ marginBottom: 10 }}>Create Admin</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Username" register={register("a_username")} error={errors.a_username?.message} />
          <Input label="Password" type="password" register={register("a_password")} error={errors.a_password?.message} />
          <Input label="Full Name" register={register("a_fullname")} />
          <Input label="Email" type="email" register={register("a_email")} error={errors.a_email?.message} />

          <button type="submit" disabled={isSubmitting} className={styles.primaryBtn}>
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <div className={`${styles.card} mt-4`}> {}
        <h3>Existing Admins</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          admins.map((a) => (
            <div key={a.a_id} className={styles.listItem}>
              <strong>{a.a_username}</strong>
              <div style={{ fontSize: 13, color: "#666" }}>
                {a.a_fullname || "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

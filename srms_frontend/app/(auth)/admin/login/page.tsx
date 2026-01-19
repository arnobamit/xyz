"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminLoginSchema,
  type AdminLoginInput,
} from "@/lib/validations/admin";
import { useRouter } from "next/navigation";
import axios from "axios";
import Input from "@/components/Input";

export default function AdminLoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginInput) => {
    try {
      const res = await axios.post("/api/auth/admin/login", data);
      localStorage.setItem("admin_token", res.data.token);

      alert("Admin Login Successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert("Login Failed: " + (error.response?.data?.message || "Invalid"));
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "30px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          Admin Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            type="text"
            register={register("a_username")}
            error={errors.a_username?.message}
          />
          <Input
            label="Password"
            type="password"
            register={register("a_password")}
            error={errors.a_password?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isSubmitting ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

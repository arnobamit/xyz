import { z } from "zod";

/* LOGIN (unchanged) */
export const adminLoginSchema = z.object({
  a_username: z.string().min(1, "Username is required"),
  a_password: z.string().min(6, "Password must be at least 6 characters"),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/* CREATE ADMIN (updated with email) */
export const adminCreateSchema = z.object({
  a_username: z.string().min(3, "Username is required"),
  a_email: z.string().email("Invalid email address"), // ✅ NEW
  a_password: z.string().min(6, "Password must be at least 6 characters"),
  a_fullname: z.string().optional(),
});

export type AdminCreateInput = z.infer<typeof adminCreateSchema>;

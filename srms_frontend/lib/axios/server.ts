import axios from "axios";
import { cookies } from "next/headers";

export async function serverAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

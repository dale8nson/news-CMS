import { redirect } from "next/navigation"

export const GET = () => {
  redirect('/api/admin/dashboard');
}
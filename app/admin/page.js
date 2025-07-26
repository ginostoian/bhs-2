import { redirect } from "next/navigation";

/**
 * Admin Home Page
 * Redirects to the admin dashboard
 */
export default function AdminHomePage() {
  redirect("/admin/dashboard");
}

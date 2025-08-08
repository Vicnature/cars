import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    // redirect("/login");
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.name}</p>

      {/* Link to sub-pages */}
      <div className="mt-4 space-x-4">
        <a href="/admin/orders" className="text-blue-600 underline">Manage Orders</a>
        <a href="/admin/users" className="text-blue-600 underline">View Customers</a>
        <a href="/admin/admins" className="text-blue-600 underline">Manage Admins</a>
      </div>
    </main>
  );
}

// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const adminLinks = [
    {
      title: "Manage Orders",
      href: "/admin/orders",
      description: "View and process all incoming orders.",
    },
    {
      title: "View Customers",
      href: "/admin/users",
      description: "Browse and manage registered customers.",
    },
    {
      title: "Manage Admins",
      href: "/admin/admins",
      description: "Add, edit, or remove admin accounts.",
    },
    {
      title: "Manage Payment Instructions",
      href: "/admin/paymentInstructions",
      description: "Edit and update customer payment guidelines.",
    },
    {
      title: "Manage Products",
      href: "/admin/products",
      description: "Add, edit, and manage the product catalog.",
    },
    {
      title: "View Reports",
      href: "/admin/reports",
      description: "Track performance and view key business metrics.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Welcome,{" "}
          <span className="inline-block bg-blue-50 text-blue-800 font-semibold px-3 py-1 rounded-full shadow-sm">
            {session.user.name}
          </span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href} className="h-full">
            <div className="group flex flex-col justify-between bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8 hover:border-blue-200 min-h-[200px]">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-200">
                  {link.title}
                </h2>
                <p className="text-gray-500 leading-relaxed">{link.description}</p>
              </div>
              <div className="mt-6 text-blue-600 font-medium group-hover:underline">
                Go →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

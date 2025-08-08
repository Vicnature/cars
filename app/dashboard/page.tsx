// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import DashboardLayout from "@/components/DashboardLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div className="text-center mt-20 text-red-500">You must be logged in to access the dashboard.</div>;
  }

  return <DashboardLayout session={session} />;
}

// components/dashboard/AdminDashboard.tsx
import ManageOrders from "./ManageOrders";
import ManageParts from "./ManageParts";
import ManageUsers from "./ManageUsers";

export default function AdminDashboard({ tab }: { tab: string }) {
  return (
    <>
      {tab === "orders" && <ManageOrders />}
      {tab === "parts" && <ManageParts />}
      {tab === "users" && <ManageUsers />}
    </>
  );
}

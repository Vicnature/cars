// components/dashboard/CustomerDashboard.tsx
import MyOrders from "./MyOrders";
import ProfileCard from "./ProfileCard";

export default function CustomerDashboard({
  tab,
  userEmail,
}: {
  tab: string;
  userEmail: string;
}) {
  return (
    <>
      {tab === "profile" && <ProfileCard userEmail={userEmail} />}
      {tab === "orders" && <MyOrders userEmail={userEmail} />}
    </>
  );
}

export default function MyOrders({ userEmail }: { userEmail: string }) {
  return <div className="bg-white p-4 shadow">Listing orders for {userEmail}</div>;
}
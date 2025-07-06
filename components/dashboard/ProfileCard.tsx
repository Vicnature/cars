export default function ProfileCard({ userEmail }: { userEmail: string }) {
  return <div className="bg-white p-4 shadow">Welcome, {userEmail}</div>;
}
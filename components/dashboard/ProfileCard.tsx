// components/dashboard/ProfileCard.tsx
"use client";
import React from "react";

export default function ProfileCard({ user }: { user: any }) {
  if (!user) return <p className="text-red-500">User not found.</p>;

  const displayName = user.name || user.email || "Unknown User";

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-bold text-lg">{displayName}</h2>
      {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
    </div>
  );
}

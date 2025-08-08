"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchUsers = () => {
    fetch("/api/listUsers")
      .then(r => r.json())
      .then(d => setUsers(d.users));
  };

  useEffect(fetchUsers, []);

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "" });
  };

  const handleSave = async (id: string) => {
    setLoadingId(id);
    await fetch("/api/updateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    setEditingId(null);
    setLoadingId(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoadingId(id);
    await fetch(`/api/deleteUser?id=${id}`, { method: "DELETE" });
    setLoadingId(null);
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">👥 Customer Management</h1>

      <div className="overflow-x-auto shadow-lg border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Name", "Email", "Orders", "Actions"].map(h => (
                <th key={h} className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>

                <td className="py-3 px-4">
                  {editingId === u._id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    u.name
                  )}
                </td>

                <td className="py-3 px-4">
                  {editingId === u._id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    u.email
                  )}
                </td>

                <td className="py-3 px-4">
                  <Link
                    href={`/admin/users/${u._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Orders
                  </Link>
                </td>

                <td className="py-3 px-4 space-x-2">
                  {editingId === u._id ? (
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        onClick={() => handleSave(u._id)}
                        disabled={loadingId === u._id}
                      >
                        {loadingId === u._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        onClick={() => handleDelete(u._id)}
                        disabled={loadingId === u._id}
                      >
                        {loadingId === u._id ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

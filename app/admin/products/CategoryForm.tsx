"use client";

import { useState, useEffect } from "react";

export default function CategoryForm() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [flash, setFlash] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories/list");
    const data = await res.json();
    setCategories(data.categories || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!form.name) return setFlash("Name is required");
    const res = await fetch("/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setFlash("✅ Category saved");
      setForm({ name: "", description: "" });
      fetchCategories();
    } else {
      const err = await res.json();
      setFlash("❌ " + err.message);
    }
  };

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat._id);
    setFlash("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const res = await fetch("/api/categories/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...form }),
    });
    if (res.ok) {
      setFlash("✅ Category updated");
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } else {
      const err = await res.json();
      setFlash("❌ " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/delete ?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">📂 Manage Categories</h2>

      {flash && <p className="text-sm text-blue-700">{flash}</p>}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Category Name"
          className="border p-2 rounded flex-1"
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={editingId ? handleUpdate : handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="divide-y">
        {categories.map(cat => (
          <li key={cat._id} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(cat)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
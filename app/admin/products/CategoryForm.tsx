"use client";

import { useState, useEffect, useRef } from "react";

export default function CategoryForm() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [flash, setFlash] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories/list");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      setFlash("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-clear flash after 3 seconds
  useEffect(() => {
    if (flash) {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(""), 3000);
    }
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, [flash]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return setFlash("Name is required");
    try {
      setLoading(true);
      const res = await fetch("/api/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFlash("Success: Category saved");
        setForm({ name: "", description: "" });
        fetchCategories();
      } else {
        const err = await res.json();
        setFlash("Error: " + err.message);
      }
    } catch {
      setFlash("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, description: cat.description || "" });
    setEditingId(cat._id);
    setFlash("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      const res = await fetch("/api/categories/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      if (res.ok) {
        setFlash("Success: Category updated");
        setForm({ name: "", description: "" });
        setEditingId(null);
        fetchCategories();
      } else {
        const err = await res.json();
        setFlash("Error: " + err.message);
      }
    } catch {
      setFlash("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This action cannot be undone.")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/delete?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFlash("Category deleted");
        fetchCategories();
      } else {
        const err = await res.json();
        setFlash("Error: " + err.message);
      }
    } catch {
      setFlash("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold"> Manage Categories</h2>

      {flash && (
        <p className="text-sm text-blue-700 border border-blue-300 rounded p-2">{flash}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          aria-label="Category Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Category Name"
          className="border p-2 rounded flex-1 disabled:bg-gray-100"
          disabled={loading}
        />
        <input
          aria-label="Category Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 rounded flex-1 disabled:bg-gray-100"
          disabled={loading}
        />
        <button
          onClick={editingId ? handleUpdate : handleSubmit}
          className={`px-4 py-2 rounded font-semibold text-white ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
          aria-busy={loading}
          aria-label={editingId ? "Update Category" : "Add Category"}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      <ul className="divide-y border rounded">
        {categories.length === 0 && !loading && (
          <li className="p-4 text-center text-gray-500">No categories found.</li>
        )}
        {categories.map((cat) => (
          <li key={cat._id} className="py-3 px-4 flex justify-between items-center hover:bg-gray-50 transition rounded">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-gray-600 truncate max-w-xl">{cat.description}</p>
            </div>
            <div className="space-x-3 flex-shrink-0">
              <button
                onClick={() => handleEdit(cat)}
                className="text-blue-600 hover:underline text-sm"
                aria-label={`Edit category ${cat.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline text-sm"
                aria-label={`Delete category ${cat.name}`}
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

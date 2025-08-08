"use client";

import { useState, useEffect } from "react";

interface SparePart {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: { asset: { url: string } }[];
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
  model?: { _id: string; name: string };
}

// Slugify helper
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function SparePartForm() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    brandId: "",
    categoryId: "",
    modelId: "",
    year: "",
    inStock: true,
  });

  const [flash, setFlash] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  // ---- FETCH HELPERS ----
  const fetchBrands = async () => {
    const res = await fetch("/api/brands/list");
    const data = await res.json();
    setBrands(data.brands || []);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories/list");
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const fetchModels = async () => {
    const res = await fetch("/api/models/list");
    const data = await res.json();
    setModels(data.models || []);
  };

  const fetchSpareParts = async () => {
    const res = await fetch("/api/spareParts/list");
    const data = await res.json();
    setSpareParts(data.parts || []);
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchModels();
    fetchSpareParts();
  }, []);

  // ---- FORM ACTIONS ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      brandId: form.brandId,
      modelId: form.modelId,
      categoryId: form.categoryId,
      year: form.year,
      price: form.price ? Number(form.price) : undefined,
      inStock: form.inStock,
      description: form.description,
    };

    const res = await fetch("/api/spareParts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setFlash("✅ Spare part saved");
      resetForm();
      fetchSpareParts();
    } else {
      setFlash(`❌ ${data.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const payload = {
      id: editingId,
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      price: form.price ? Number(form.price) : undefined,
      brandId: form.brandId,
      categoryId: form.categoryId,
      modelId: form.modelId,
      year: form.year,
      inStock: form.inStock,
    };

    const res = await fetch("/api/spareParts/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setFlash("✅ Spare part updated");
      resetForm();
      fetchSpareParts();
    } else {
      setFlash(`❌ ${data.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this spare part?")) return;
    await fetch(`/api/spareParts/delete?id=${id}`, { method: "DELETE" });
    fetchSpareParts();
  };

  const handleEdit = (sp: SparePart) => {
    setForm({
      title: sp.title,
      slug: slugify(sp.title),
      description: sp.description || "",
      price: sp.price ? String(sp.price) : "",
      brandId: sp.brand?._id || "",
      categoryId: sp.category?._id || "",
      modelId: sp.model?._id || "",
      year: "",
      inStock: true,
    });
    setEditingId(sp._id);
    setFlash("");
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      price: "",
      brandId: "",
      categoryId: "",
      modelId: "",
      year: "",
      inStock: true,
    });
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">🔧 Manage Spare Parts</h2>

      {flash && <p className="text-sm text-blue-700">{flash}</p>}

      <form
        onSubmit={
          editingId
            ? (e) => {
                e.preventDefault();
                handleUpdate();
              }
            : handleSubmit
        }
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        <input
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: slugify(e.target.value),
            })
          }
          placeholder="Spare Part Title"
          className="border p-2 rounded"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          placeholder="Slug"
          className="border p-2 rounded"
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price (KES)"
          type="number"
          className="border p-2 rounded"
        />
        <select
          value={form.brandId}
          onChange={(e) => setForm({ ...form, brandId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={form.modelId}
          onChange={(e) => setForm({ ...form, modelId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Car Model</option>
          {models.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="Year Compatibility"
          className="border p-2 rounded"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 rounded col-span-1 sm:col-span-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 sm:col-span-2"
        >
          {editingId ? "Update Spare Part" : "Add Spare Part"}
        </button>
      </form>

      <ul className="divide-y">
        {spareParts.map((sp) => (
          <li
            key={sp._id}
            className="py-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {sp.title} - KES {sp.price}
              </p>
              <p className="text-sm text-gray-600">
                {sp.brand?.name} | {sp.category?.name} | {sp.model?.name}
              </p>
              {sp.images?.[0]?.asset?.url && (
                <img
                  src={sp.images[0].asset.url}
                  alt={sp.title}
                  className="h-12 mt-1"
                />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(sp)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sp._id)}
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

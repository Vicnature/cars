/** @format */

"use client";

import { useState, useEffect } from "react";
import { uploadImageToSanity } from "@/utils/uploadImageToSanity";

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
		description: "",
		price: "",
		brandId: "",
		categoryId: "",
		modelId: "",
		year: "",
		inStock: true,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

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
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setFlash("");

		try {
			let uploadedImage = null;

			if (imageFile) {
				uploadedImage = await uploadImageToSanity(imageFile);
			}

			const payload = {
				title: form.title,
				slug: slugify(form.title),
				brandId: form.brandId,
				modelId: form.modelId,
				categoryId: form.categoryId,
				year: form.year,
				price: form.price ? Number(form.price) : undefined,
				inStock: form.inStock,
				description: form.description,
				image: uploadedImage, // now a proper Sanity image ref
			};

			const res = await fetch("/api/spareParts/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (res.ok) {
				setFlash("Success: Spare part saved");
				resetForm();
				fetchSpareParts();
			} else {
				setFlash(`Error ${data.message}`);
			}
		} catch (err) {
			console.error(err);
			setFlash("Error Error saving spare part");
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setForm({
			title: "",
			description: "",
			price: "",
			brandId: "",
			categoryId: "",
			modelId: "",
			year: "",
			inStock: true,
		});
		setImageFile(null);
		setEditingId(null);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			<h2 className="text-2xl font-semibold">🔧 Manage Spare Parts</h2>

			{flash && <p className="text-sm text-blue-700">{flash}</p>}

			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 sm:grid-cols-2 gap-4"
			>
				<label>
					Title
					<input
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						className="border p-2 rounded w-full"
						required
					/>
				</label>

				<label>
					Price (KES)
					<input
						value={form.price}
						onChange={(e) => setForm({ ...form, price: e.target.value })}
						type="number"
						className="border p-2 rounded w-full"
					/>
				</label>

				<label>
					Brand
					<select
						value={form.brandId}
						onChange={(e) => setForm({ ...form, brandId: e.target.value })}
						className="border p-2 rounded w-full"
					>
						<option value="">Select Brand</option>
						{brands.map((b) => (
							<option key={b._id} value={b._id}>
								{b.name}
							</option>
						))}
					</select>
				</label>

				<label>
					Category
					<select
						value={form.categoryId}
						onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
						className="border p-2 rounded w-full"
					>
						<option value="">Select Category</option>
						{categories.map((c) => (
							<option key={c._id} value={c._id}>
								{c.name}
							</option>
						))}
					</select>
				</label>

				<label>
					Car Model
					<select
						value={form.modelId}
						onChange={(e) => setForm({ ...form, modelId: e.target.value })}
						className="border p-2 rounded w-full"
					>
						<option value="">Select Model</option>
						{models.map((m) => (
							<option key={m._id} value={m._id}>
								{m.name}
							</option>
						))}
					</select>
				</label>

				<label>
					Year Compatibility
					<input
						value={form.year}
						onChange={(e) => setForm({ ...form, year: e.target.value })}
						className="border p-2 rounded w-full"
					/>
				</label>

				<label className="col-span-1 sm:col-span-2">
					Description
					<textarea
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						className="border p-2 rounded w-full"
					/>
				</label>

				<label className="col-span-1 sm:col-span-2">
					Image
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImageFile(e.target.files?.[0] || null)}
						className="border p-2 rounded w-full"
					/>
				</label>

				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 sm:col-span-2 flex justify-center items-center"
					disabled={loading}
				>
					{loading ? "⏳ Saving..." : "Add Spare Part"}
				</button>
			</form>

			<ul className="divide-y">
				{spareParts.map((sp) => (
					<li key={sp._id} className="py-2 flex justify-between items-center">
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
					</li>
				))}
			</ul>
		</div>
	);
}

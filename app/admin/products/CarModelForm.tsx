/** @format */

"use client";
import { useEffect, useState } from "react";

export default function ManageModels() {
	const [models, setModels] = useState<any[]>([]);
	const [brands, setBrands] = useState<any[]>([]);
	const [form, setForm] = useState({ name: "", brandId: "", year: "" });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [flash, setFlash] = useState("");

	const fetchModels = async () => {
		const res = await fetch("/api/models/list");
		const data = await res.json();
		setModels(data.models || []);
	};

	const fetchBrands = async () => {
		const res = await fetch("/api/brands/list");
		const data = await res.json();
		setBrands(data.brands || []);
	};

	useEffect(() => {
		fetchModels();
		fetchBrands();
	}, []);

	const handleCreate = async () => {
		if (!form.name || !form.brandId || !form.year) {
			setFlash("All fields are required");
			return;
		}

		setIsCreating(true);

		const payload = {
			name: form.name,
			brand: form.brandId, // Success: Aligns with backend
			year: parseInt(form.year),
		};

		const res = await fetch("/api/models/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (res.ok) {
			setFlash("Success: Model created");
			setForm({ name: "", brandId: "", year: "" });
			fetchModels();
		} else {
			const err = await res.json();
			setFlash("Error: " + (err.message || "Failed to create model"));
		}

		setIsCreating(false);
	};

	const handleEdit = (m: any) => {
		setEditingId(m._id);
		setForm({
			name: m.name,
			brandId: m.brand?._ref || "",
			year: m.year?.toString() || "",
		});
		setFlash("");
	};

	const handleCancel = () => {
		setEditingId(null);
		setForm({ name: "", brandId: "", year: "" });
	};

	const handleSave = async (id: string) => {
		setLoadingId(id);

		const payload = {
			id,
			name: form.name,
			brand: form.brandId, // Success: Aligns with backend
			year: parseInt(form.year),
		};

		await fetch("/api/models/update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		setLoadingId(null);
		setFlash("Success: Model updated");
		setEditingId(null);
		setForm({ name: "", brandId: "", year: "" });
		fetchModels();
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this model?")) return;

		setLoadingId(id);
		setFlash(""); // Clear previous flash

		try {
			const res = await fetch(`/api/models/delete?id=${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});

			if (res.ok) {
				setModels((prev) => prev.filter((m) => m._id !== id));
				setFlash("Success: Model deleted");
			} else {
				const err = await res.json();
				setFlash("Error " + (err.message || "Delete failed"));
			}
		} catch (error) {
			console.error("Unexpected delete error:", error);
			setFlash("Error Unexpected error during delete.");
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="p-8 max-w-3xl mx-auto space-y-6">
			<h1 className="text-3xl font-bold"> Car Model Management</h1>

			{flash && (
				<p className="bg-blue-100 text-blue-800 px-4 py-2 rounded">{flash}</p>
			)}

			<ul className="divide-y divide-gray-200">
				{models.map((m) => (
					<li key={m._id} className="flex justify-between items-center py-3">
						{editingId === m._id ?
							<div className="flex-1 space-y-1">
								<input
									type="text"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									className="border p-1 rounded w-full"
									placeholder="Model Name"
								/>
								<select
									value={form.brandId}
									onChange={(e) =>
										setForm({ ...form, brandId: e.target.value })
									}
									className="border p-1 rounded w-full"
								>
									<option value="">Select Brand</option>
									{brands.map((b) => (
										<option key={b._id} value={b._id}>
											{b.name}
										</option>
									))}
								</select>
								<input
									type="number"
									value={form.year}
									onChange={(e) => setForm({ ...form, year: e.target.value })}
									placeholder="Year"
									className="border p-1 rounded w-full"
								/>
							</div>
						:	<div>
								<p className="font-semibold">{m.name}</p>
								<p className="text-sm text-gray-600">
									{m.brandName} - {m.year}
								</p>
							</div>
						}

						<div className="space-x-2">
							{editingId === m._id ?
								<>
									<button
										className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
										onClick={() => handleSave(m._id)}
										disabled={loadingId === m._id}
									>
										{loadingId === m._id ? "Saving..." : "Save"}
									</button>
									<button
										className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
										onClick={handleCancel}
									>
										Cancel
									</button>
								</>
							:	<>
									<button
										className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
										onClick={() => handleEdit(m)}
									>
										Edit
									</button>
									<button
										className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
										onClick={() => handleDelete(m._id)}
										disabled={loadingId === m._id}
									>
										{loadingId === m._id ? "Deleting..." : "Delete"}
									</button>
								</>
							}
						</div>
					</li>
				))}
			</ul>

			<div className="mt-6 bg-gray-50 p-4 rounded">
				<h2 className="font-semibold mb-2">Add New Car Model</h2>
				<div className="flex flex-col gap-2">
					<input
						type="text"
						placeholder="Model Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						className="border p-2 rounded w-full"
					/>
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
					<input
						type="number"
						placeholder="Year"
						value={form.year}
						onChange={(e) => setForm({ ...form, year: e.target.value })}
						className="border p-2 rounded w-full"
					/>
					<button
						onClick={handleCreate}
						className="bg-blue-600 text-white px-4 py-2 rounded"
						disabled={isCreating}
					>
						{isCreating ? "Creating..." : "Add Model"}
					</button>
				</div>
			</div>
		</div>
	);
}

"use client";
import { useEffect, useState } from "react";

export default function BrandForm() {
	const [brands, setBrands] = useState<any[]>([]);
	const [name, setName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [flash, setFlash] = useState("");

	const fetchBrands = async () => {
		const res = await fetch("/api/brands/list");
		const data = await res.json();
		setBrands(data.brands || []);
	};

	useEffect(() => {
		fetchBrands();
	}, []);

	const handleSubmit = async () => {
		if (!name.trim()) return;

		const method = editingId ? "PUT" : "POST";
		const url = editingId ? `/api/brands/update?id=${editingId}` : "/api/brands/create";

		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});

		if (res.ok) {
			setFlash("✅ Saved");
			setName("");
			setEditingId(null);
			fetchBrands();
		} else {
			setFlash("❌ Error saving");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this brand?")) return;
		await fetch(`/api/brands/delete?id=${id}`, { method: "DELETE" });
		fetchBrands();
	};

	return (
		<div>
			{flash && <p className="text-sm text-green-600 mb-2">{flash}</p>}

			<div className="flex space-x-2 mb-4">
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Brand Name"
					className="border px-3 py-2 rounded w-full"
				/>
				<button
					onClick={handleSubmit}
					className="bg-blue-600 text-white px-4 py-2 rounded"
				>
					{editingId ? "Update" : "Add"}
				</button>
			</div>

			<ul className="divide-y">
				{brands.map((b) => (
					<li key={b._id} className="py-2 flex justify-between items-center">
						<span>{b.name}</span>
						<div className="space-x-2">
							<button
								onClick={() => {
									setName(b.name);
									setEditingId(b._id);
								}}
								className="text-sm text-blue-600"
							>
								Edit
							</button>
							<button
								onClick={() => handleDelete(b._id)}
								className="text-sm text-red-600"
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

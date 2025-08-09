/** @format */

"use client";
import { useEffect, useState } from "react";

export default function ManageAdmins() {
	const [admins, setAdmins] = useState<any[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [flash, setFlash] = useState("");
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const fetchAdmins = async () => {
		const res = await fetch("/api/listAdmins");
		const data = await res.json();
		setAdmins(data.admins || []);
	};

	useEffect(() => {
		const load = async () => {
			await fetchAdmins();
		};
		load();
	}, []);

	const handleCreate = async () => {
		if (!form.name || !form.email || !form.password) {
			setFlash("All fields are required");
			return;
		}
		setIsCreating(true);
		const res = await fetch("/api/createAdmin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		if (res.ok) {
			setFlash("Success: Admin created");
			setForm({ name: "", email: "", password: "" });
			fetchAdmins();
		} else {
			const err = await res.json();
			setFlash("Error " + (err.message || "Failed to create admin"));
		}
		setIsCreating(false);
	};

	const handleEdit = (admin: any) => {
		setEditingId(admin._id);
		setForm({ name: admin.name, email: admin.email, password: "" });
		setFlash("");
	};

	const handleCancel = () => {
		setEditingId(null);
		setForm({ name: "", email: "", password: "" });
	};

	const handleSave = async (id: string) => {
		setLoadingId(id);
		await fetch("/api/updateAdmin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, ...form }),
		});
		setLoadingId(null);
		setFlash("Admin updated");
		setEditingId(null);
		setForm({ name: "", email: "", password: "" });
		fetchAdmins();
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this admin?")) return;
		setLoadingId(id);
		await fetch(`/api/deleteAdmin?id=${id}`, { method: "DELETE" });
		setLoadingId(null);
		setAdmins((prev) => prev.filter((a) => a._id !== id));
		setFlash("Admin deleted");
	};

	return (
		<div className="p-8 max-w-3xl mx-auto space-y-6">
			<h1 className="text-3xl font-bold">Admin Management</h1>

			{flash && (
				<p className="bg-blue-100 text-blue-800 px-4 py-2 rounded">{flash}</p>
			)}

			<ul className="divide-y divide-gray-200">
				{admins.map((a) => (
					<li key={a._id} className="flex justify-between items-center py-3">
						{editingId === a._id ?
							<>
								<div className="flex-1 space-y-1">
									<input
										type="text"
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										className="border p-1 rounded w-full"
										placeholder="Name"
									/>
									<input
										type="email"
										value={form.email}
										onChange={(e) =>
											setForm({ ...form, email: e.target.value })
										}
										className="border p-1 rounded w-full"
										placeholder="Email"
									/>
									<input
										type="password"
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										className="border p-1 rounded w-full"
										placeholder="New Password (optional)"
									/>
								</div>
								<div className="space-x-2 ml-4">
									<button
										className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
										onClick={() => handleSave(a._id)}
										disabled={loadingId === a._id}
									>
										{loadingId === a._id ? "Saving..." : "Save"}
									</button>
									<button
										className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
										onClick={handleCancel}
									>
										Cancel
									</button>
								</div>
							</>
						:	<>
								<div>
									<p className="font-semibold">{a.name}</p>
									<p className="text-sm text-gray-600">{a.email}</p>
								</div>
								<div className="space-x-2">
									<button
										className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
										onClick={() => handleEdit(a)}
									>
										Edit
									</button>
									<button
										className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
										onClick={() => handleDelete(a._id)}
										disabled={loadingId === a._id}
									>
										{loadingId === a._id ? "Deleting..." : "Delete"}
									</button>
								</div>
							</>
						}
					</li>
				))}
				{admins.length === 0 && (
					<li className="py-3 text-gray-500">No admins yet.</li>
				)}
			</ul>

			<div className="mt-6 bg-gray-50 p-4 rounded">
				<h2 className="font-semibold mb-2">Add New Admin</h2>
				<div className="flex flex-col sm:flex-row gap-2">
					<input
						type="text"
						placeholder="Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						className="border p-2 rounded flex-1"
					/>
					<input
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						className="border p-2 rounded flex-1"
					/>
					<input
						type="password"
						placeholder="Password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						className="border p-2 rounded flex-1"
					/>
					<button
						onClick={handleCreate}
						className="bg-blue-600 text-white px-4 py-2 rounded"
						disabled={isCreating}
					>
						{isCreating ? "Creating..." : "Add Admin"}
					</button>
				</div>
			</div>
		</div>
	);
}

/** @format */

// components/DashboardLayout.tsx
"use client";

import { useState } from "react";
import CustomerDashboard from "./dashboard/CustomerDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

export default function DashboardLayout({ session }: { session: any }) {
	const [activeTab, setActiveTab] = useState("profile");

	const isAdmin = session?.user?.role === "admin";

	const tabs =
		isAdmin ?
			[
				{ label: "Manage Orders", value: "orders" },
				{ label: "Manage Parts", value: "parts" },
				{ label: "Manage Users", value: "users" },
			]
		:	[
				{ label: "My Profile", value: "profile" },
				{ label: "My Orders", value: "orders" },
				{ label: "Browse Parts", value: "browse" },
			];

	return (
		<div className="max-w-5xl mx-auto mt-10">
			<h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

			<div className="flex space-x-4 justify-center mb-8">
				{tabs.map((tab) => (
					<button
						key={tab.value}
						onClick={() => setActiveTab(tab.value)}
						className={`px-4 py-2 rounded cursor-pointer ${
							activeTab === tab.value ? "bg-blue-600 text-white" : "bg-gray-200"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div>
				{isAdmin ?
					<AdminDashboard tab={activeTab} />
				:	<CustomerDashboard tab={activeTab} userEmail={session.user.email} />}
			</div>
		</div>
	);
}

/** @format */

"use client";

import { useEffect, useState } from "react";
import MyOrders from "./MyOrders";
import ProfileCard from "./ProfileCard";
import PartsCatalogue from "./PartsCatalogue";

export default function CustomerDashboard({
	tab,
	userEmail,
}: {
	tab: string;
	userEmail: string;
}) {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/getUser");
				if (!res.ok) {
					throw new Error("Failed to fetch user");
				}
				const data = await res.json();
				setUser(data.user);
			} catch (err) {
				console.error("Error fetching user:", err);
				setError("User not found or fetch failed");
			}
		};

		fetchUser();
	}, []);

	return (
		<div className="space-y-6">
			{error && (
				<p className="text-red-500 font-semibold text-center">{error}</p>
			)}
			{tab === "profile" && <ProfileCard user={user} />}
			{tab === "orders" && <MyOrders userEmail={userEmail} />}
			{tab === "browse" && <PartsCatalogue />}
		</div>
	);
}

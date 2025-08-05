"use client";

import { useEffect, useState } from "react";

export default function MyOrders({ userEmail }: { userEmail: string }) {
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch(`/api/getOrders?email=${encodeURIComponent(userEmail)}`);
				if (!res.ok) throw new Error("Failed to fetch orders");

				const data = await res.json();
				setOrders(data.orders);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		if (userEmail) {
			fetchOrders();
		}
	}, [userEmail]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-40">
				<p className="text-gray-600 text-sm">Loading your orders...</p>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="text-center py-10">
				<p className="text-gray-500 text-sm">You haven’t placed any orders yet.</p>
			</div>
		);
	}

	return (
		<main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
			<section className="space-y-4">
				{orders.map((order, index) => (
					<div
						key={index}
						className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 px-4 py-3 text-sm shadow-sm"
					>
						<div className="flex justify-between items-center mb-1">
							<h3 className="font-semibold text-gray-800 dark:text-gray-100">
								Order #{index + 1}
							</h3>
							<span
								className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
									order.status === "processing"
										? "bg-yellow-100 text-yellow-800"
										: order.status === "dispatched"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{order.status}
							</span>
						</div>

						<div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm mb-1">
							<span>{order.part?.title || "Unknown Part"} × {order.quantity}</span>
							<span>{new Date(order._createdAt).toLocaleDateString()}</span>
						</div>

						<div className="text-xs text-gray-500">
							Payment:{" "}
							<span
								className={`ml-1 px-2 py-0.5 text-xs font-medium rounded-full ${
									order.paymentStatus === "approved"
										? "bg-green-100 text-green-800"
										: order.paymentStatus === "pending"
										? "bg-yellow-100 text-yellow-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{order.paymentStatus}
							</span>
						</div>

						{order.location && (
							<div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
								<span className="font-medium">Address:</span> {order.location}
							</div>
						)}
					</div>
				))}
			</section>
		</main>
	);
}

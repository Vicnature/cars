/** @format */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MyOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/getOrders?email=${encodeURIComponent(userEmail!)}`);
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

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">🛒 You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {orders.map((order, index) => (
        <div
          key={order._id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm transition hover:shadow-md"
        >
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Order {index + 1}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Placed on{" "}
                <span className="font-medium">
                  {new Date(order._createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Status */}
            <span
              className={`mt-2 md:mt-0 inline-block text-xs font-medium px-4 py-1 rounded-full capitalize
                ${
                  order.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "dispatched"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
            >
              {order.status || "processing"}
            </span>
          </div>

          {/* Item */}
          <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-semibold">Item</p>
            <p className="text-base text-gray-800 dark:text-gray-100">
              {order.part?.title || "Unknown Part"} ×{" "}
              <span className="font-semibold">{order.quantity}</span>
            </p>
          </div>

          {/* Location */}
          {order.location && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-semibold">
                Shipping Address
              </p>
              <p className="text-base text-gray-800 dark:text-gray-100">{order.location}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

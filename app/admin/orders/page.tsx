"use client";

import React, { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { writeClient } from "@/lib/sanity.write";
import { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    sanityClient
      .fetch<Order[]>(
        `*[_type=="order"] | order(_createdAt desc){
          _id,
          status,
          paymentStatus,
          paymentToken,
          customerName,
          contact,
          quantity,
          location,
          part->{title},
          createdAt
        }`
      )
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  const patchAndRefresh = async (
    id: string,
    data: Partial<Order>,
    successMessage: string
  ) => {
    setUpdatingId(id);
    try {
      await writeClient.patch(id).set(data).commit();
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, ...data } : order
        )
      );
    } catch (err) {
      console.error(`Failed to update order ${id}:`, err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center py-10">Loading orders…</p>;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Orders Dashboard</h1>

      <div className="overflow-x-auto shadow-lg border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Customer", "Part", "Qty", "Date", "Order Status", "Payment Status", "Token", "Actions"].map(h => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-sm font-semibold text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">{o.customerName}</td>
                <td className="py-3 px-4">{o.part?.title || "-"}</td>
                <td className="py-3 px-4">{o.quantity}</td>
                <td className="py-3 px-4">{new Date(o.createdAt).toLocaleString()}</td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    o.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : o.status === "dispatched"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {o.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    o.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : o.paymentStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {o.paymentStatus}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono text-sm">
                  {o.paymentToken || "-"}
                </td>

                <td className="py-3 px-4 flex flex-wrap gap-2">
                  {updatingId === o._id && (
                    <span className="text-xs text-gray-500">Updating...</span>
                  )}

                  {o.paymentStatus === "pending" && (
                    <>
                      <button
                        className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={updatingId === o._id}
                        onClick={() =>
                          patchAndRefresh(o._id, { paymentStatus: "approved" }, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        disabled={updatingId === o._id}
                        onClick={() =>
                          patchAndRefresh(o._id, { paymentStatus: "rejected" }, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {o.paymentStatus === "approved" && o.status === "processing" && (
                    <button
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={updatingId === o._id}
                      onClick={() =>
                        patchAndRefresh(o._id, { status: "dispatched" }, "Dispatched")
                      }
                    >
                      Dispatch
                    </button>
                  )}

                  {o.paymentStatus === "rejected" && o.status === "processing" && (
                    <button
                      className="bg-gray-600 text-white text-xs px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
                      disabled={updatingId === o._id}
                      onClick={() =>
                        patchAndRefresh(o._id, { status: "cancelled" }, "Cancelled")
                      }
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 px-4 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

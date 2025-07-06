"use client";

import React, { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch<Order[]>(`*[_type=="order"] | order(createdAt desc){
        _id,
        customerName,
        contact,
        quantity,
        location,
        part->{
          _id,
          title
        },
        createdAt
      }`)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📦 Orders Dashboard</h1>
      {loading ? (
        <p>Loading orders…</p>
      ) : (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                {["Order ID", "Date", "Customer", "Contact", "Part", "Qty", "Location"].map(header => (
                  <th key={header} className="py-3 px-4 text-left text-sm font-medium text-gray-600">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs font-mono">{o._id}</td>
                  <td className="py-3 px-4 text-sm">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">{o.customerName}</td>
                  <td className="py-3 px-4 text-sm">{o.contact}</td>
                  <td className="py-3 px-4 text-sm">{o.part?.title || "–"}</td>
                  <td className="py-3 px-4 text-sm">{o.quantity}</td>
                  <td className="py-3 px-4 text-sm">{o.location}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-4 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

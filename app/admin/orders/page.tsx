"use client";
import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "order"]{
        _id,
        quantity,
        customerName,
        contact,
        location,
        "part": part->title,
        createdAt
      } | order(createdAt desc)
    `).then(setOrders);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>
      <table className="w-full text-left border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Part</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Location</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{o.part}</td>
              <td className="p-2">{o.customerName || "—"}</td>
              <td className="p-2">{o.contact}</td>
              <td className="p-2">{o.quantity}</td>
              <td className="p-2">{o.location}</td>
              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

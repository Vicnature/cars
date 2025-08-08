"use client";


import { useEffect, useState } from 'react';
import {sanityClient} from '@/lib/sanity.client';
import { format } from 'date-fns';

export default function ReportPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = `{
        "parts": *[_type == "sparePart"]{title, price, inStock, brand->{name}, model->{name}, category->{name}, year},
        "orders": *[_type == "order"]{customerName, quantity, contact, paymentStatus, status, createdAt, part->{title}},
        "brands": *[_type == "brand"],
        "categories": *[_type == "category"],
        "models": *[_type == "carModel"],
        "users": *[_type == "user"]{role},
      }`;
      const result = await sanityClient.fetch(query);
      setData(result);
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading report...</p>;

  const { parts, orders, brands, categories, models, users } = data;

  const stockStatus = parts.reduce((acc: any, p: any) => {
    if (p.inStock) acc.inStock++;
    else acc.outOfStock++;
    return acc;
  }, { inStock: 0, outOfStock: 0 });

  const orderStatus = orders.reduce((acc: any, o: any) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const paymentStatus = orders.reduce((acc: any, o: any) => {
    acc[o.paymentStatus] = (acc[o.paymentStatus] || 0) + 1;
    return acc;
  }, {});

  const roleCounts = users.reduce((acc: any, u: any) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">System Report</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Spare Parts" value={parts.length} />
        <SummaryCard label="Orders" value={orders.length} />
        <SummaryCard label="Brands" value={brands.length} />
        <SummaryCard label="Models" value={models.length} />
        <SummaryCard label="Categories" value={categories.length} />
        <SummaryCard label="Users" value={users.length} />
      </div>

      {/* Order Summary */}
      <h2 className="text-xl font-semibold mb-2">Orders Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(orderStatus).map(([status, count]) => (
          <SummaryCard key={status} label={`Orders: ${status}`} value={count} />
        ))}
        {Object.entries(paymentStatus).map(([status, count]) => (
          <SummaryCard key={status} label={`Payments: ${status}`} value={count} />
        ))}
      </div>

      {/* Stock Summary */}
      <h2 className="text-xl font-semibold mb-2">Stock Status</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SummaryCard label="In Stock" value={stockStatus.inStock} />
        <SummaryCard label="Out of Stock" value={stockStatus.outOfStock} />
      </div>

      {/* User Summary */}
      <h2 className="text-xl font-semibold mb-2">User Roles</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(roleCounts).map(([role, count]) => (
          <SummaryCard key={role} label={`Users: ${role}`} value={count} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <h2 className="text-xl font-bold mt-6 mb-3">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Part</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Status</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((o, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{o.part?.title || 'N/A'}</td>
                <td className="p-2">{o.customerName}</td>
                <td className="p-2">{o.quantity}</td>
                <td className="p-2 capitalize">{o.status}</td>
                <td className="p-2 capitalize">{o.paymentStatus}</td>
                <td className="p-2">{format(new Date(o.createdAt), 'dd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Parts Table */}
      <h2 className="text-xl font-bold mt-6 mb-3">Spare Parts Inventory</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Model</th>
              <th className="p-2">Category</th>
              <th className="p-2">Year</th>
              <th className="p-2">Price (KES)</th>
              <th className="p-2">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {parts.slice(0, 10).map((p, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.brand?.name}</td>
                <td className="p-2">{p.model?.name}</td>
                <td className="p-2">{p.category?.name}</td>
                <td className="p-2">{p.year}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2">{p.inStock ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

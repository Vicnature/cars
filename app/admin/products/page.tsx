  // app/admin/add-products/page.tsx
  "use client";
  import { useState } from "react";
  import BrandForm from "./BrandForm";
  import CategoryForm from "./CategoryForm";
  import CarModelForm from "./CarModelForm";
  import SparePartForm from "./SparePartForm";

  export default function AddProductsPage() {
    const [tab, setTab] = useState("brand");

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>
        <div className="flex space-x-4 mb-4">
          {[
            { label: "Brand", value: "brand" },
            { label: "Category", value: "category" },
            { label: "Model", value: "model" },
            { label: "Spare Part", value: "part" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded font-semibold border ${
                tab === t.value ? "bg-blue-600 text-white" : "bg-white text-blue-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "brand" && <BrandForm />}
        {tab === "category" && <CategoryForm />}
        {tab === "model" && <CarModelForm />}
        {tab === "part" && <SparePartForm />}
      </div>
    );
  }

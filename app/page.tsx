"use client";

import { useState, useEffect } from "react";
import { fetchSpareParts } from "@/utils/fetchSpareParts";
import PartCard from "@/components/PartCard";

export default function Home() {
  const [allParts, setAllParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getParts = async () => {
    setLoading(true);
    try {
      const parts = await fetchSpareParts({ search: searchTerm });
      setAllParts(parts);
    } catch (error) {
      console.error("Failed to fetch parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getParts();
    }, 500); // debounce search input
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const isDataEmpty = !Array.isArray(allParts) || allParts.length < 1;

  return (
    <main className="overflow-hidden">
      <div className="mt-12 px-6 sm:px-12 max-w-screen-xl mx-auto" id="discover">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Garage Spare Parts Catalogue</h1>
          <p className="text-gray-500 mt-2">Search for spare parts by brand, model or title</p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Search parts..."
            className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading spare parts, please wait...</p>
        ) : isDataEmpty ? (
          <div className="text-center">
            <h2 className="text-black text-xl font-bold">Oops, No Results</h2>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allParts.map((part) => (
                <PartCard key={part._id} part={part} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

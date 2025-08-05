"use client";

import { useState, useEffect } from "react";
import { fetchSpareParts } from "@/utils/fetchSpareParts";
import PartCard from "@/components/PartCard";
import CustomButton from "@/components/CustomButton";

export default function PartsCatalogue() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    model: "",
    priceMin: "",
    priceMax: "",
    search: "",
  });
  const [limit, setLimit] = useState(6);

  const getParts = async () => {
    setLoading(true);
    try {
      const results = await fetchSpareParts({
        ...filters,
        priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
        priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        limit,
      });
      setParts(results || []);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getParts();
  };

  return (
    <div className="overflow-hidden px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Browse Spare Parts</h2>
        <p className="text-gray-600">Filter and explore our inventory</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearchSubmit} className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          name="search"
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2"
        />

        <select name="brand" value={filters.brand} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2">
          <option value="">All Brands</option>
          <option value="Toyota">Toyota</option>
          <option value="Subaru">Subaru</option>
          <option value="Nissan">Nissan</option>
        </select>

        <select name="category" value={filters.category} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2">
          <option value="">All Categories</option>
          <option value="Engine">Engine</option>
          <option value="Body">Body</option>
          <option value="Electrical">Electrical</option>
        </select>

        <select name="model" value={filters.model} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2">
          <option value="">All Models</option>
          <option value="Corolla">Corolla</option>
          <option value="Forester">Forester</option>
          <option value="March">March</option>
        </select>

        <input
          name="priceMin"
          type="number"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          name="priceMax"
          type="number"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </form>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading spare parts...</p>
      ) : parts.length === 0 ? (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-gray-700">No parts found</h2>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part: any) => (
              <PartCard key={part._id} part={part} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <CustomButton
              title="Load More"
              btnType="button"
              containerStyles="bg-primary-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold"
              handleClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </section>
      )}
    </div>
  );
}

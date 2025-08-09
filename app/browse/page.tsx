/** @format */

"use client";

import { useState, useEffect } from "react";
import { fetchSpareParts } from "@/utils/fetchSpareParts";
import PartCard from "@/components/PartCard";
import CustomButton from "@/components/CustomButton";

export default function Page() {
	const [parts, setParts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Store fetched filters data here:
	const [brands, setBrands] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [models, setModels] = useState<string[]>([]);

	const [filters, setFilters] = useState({
		brand: "",
		category: "",
		model: "",
		priceMin: "",
		priceMax: "",
		search: "",
	});
	const [limit, setLimit] = useState(6);

	// Fetch brands, categories, models on mount
	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const [brandsRes, categoriesRes, modelsRes] = await Promise.all([
					fetch("/api/brands/list"),
					fetch("/api/categories/list"),
					fetch("/api/models/list"),
				]);

				if (brandsRes.ok) {
					const brandsJson = await brandsRes.json();
					// Extract brand names from objects: assuming each brand has a "name" property
					setBrands(brandsJson.brands.map((b: any) => b.name));
				}
				if (categoriesRes.ok) {
					const categoriesJson = await categoriesRes.json();
					// Extract category names
					setCategories(categoriesJson.categories.map((c: any) => c.name));
				}
				if (modelsRes.ok) {
					const modelsJson = await modelsRes.json();
					// Extract model names
					setModels(modelsJson.models.map((m: any) => m.name));
				}
			} catch (err) {
				console.error("Failed to fetch filter data:", err);
			}
		};

		fetchFilters();
	}, []);

	const getParts = async () => {
		setLoading(true);
		try {
			const results = await fetchSpareParts({
				...filters,
				priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
				priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
				title: filters.search || undefined,

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

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		getParts();
	};

	// If no filters available, don't show filters section
	const showFilters =
		brands.length > 0 || categories.length > 0 || models.length > 0;

	return (
		<main className="overflow-hidden px-4 py-10 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-extrabold text-gray-900">
					Spare Parts Catalogue
				</h1>
				<p className="text-gray-600">
					Find and order spare parts from Garage Kenya
				</p>
			</div>

			{/* Search & Filters */}
			<form
				onSubmit={handleSearchSubmit}
				className={`grid md:grid-cols-3 gap-4 mb-8 ${
					showFilters ? "" : "grid-cols-1"
				}`}
			>
				<input
					name="search"
					type="text"
					placeholder="Search by title..."
					value={filters.search}
					onChange={handleInputChange}
					className="border border-gray-300 rounded-md p-2"
				/>

				{brands.length > 0 && (
					<select
						name="brand"
						value={filters.brand}
						onChange={handleInputChange}
						className="border border-gray-300 rounded-md p-2"
					>
						<option value="">All Brands</option>
						{brands.map((brand) => (
							<option key={brand} value={brand}>
								{brand}
							</option>
						))}
					</select>
				)}

				{categories.length > 0 && (
					<select
						name="category"
						value={filters.category}
						onChange={handleInputChange}
						className="border border-gray-300 rounded-md p-2"
					>
						<option value="">All Categories</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				)}

				{models.length > 0 && (
					<select
						name="model"
						value={filters.model}
						onChange={handleInputChange}
						className="border border-gray-300 rounded-md p-2"
					>
						<option value="">All Models</option>
						{models.map((model) => (
							<option key={model} value={model}>
								{model}
							</option>
						))}
					</select>
				)}

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
			{loading ?
				<p className="text-center text-gray-500">Loading spare parts...</p>
			: parts.length === 0 ?
				<div className="text-center mt-10">
					<h2 className="text-xl font-semibold text-gray-700">
						No parts found
					</h2>
					<p className="text-gray-500">Try adjusting your filters.</p>
				</div>
			:	<section>
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
			}
		</main>
	);
}

/** @format */
"use client";

import CarCard from "@/components/CarCard";
import CustomFilter from "@/components/CustomFilter";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ShowMore from "@/components/ShowMore";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/utils";
import { useState, useEffect } from "react";

export default function Home() {
	// fetch all cars
	const [allCars, setAllCars] = useState([]);
	const [loading, setLoading] = useState(false);
	const [manufacturer, setManufacturer] = useState();
	const [model, setModel] = useState();
	const [filter, setFilter] = useState();
	const [year, setYear] = useState(2024);
	const [limit, setLimit] = useState(10);
	const [fuel, setFuel] = useState('');

	const getCars=async()=>{
		setLoading(true)
		try {
			const result = await fetchCars({
				manufacturer: manufacturer || "",
				year: year || 2024,
				fuel: fuel || "",
				limit: limit || 10,
				model: model || ""

			});
			setAllCars(result)
		} catch (error) {
			console.log(error);
			
		}finally{
			setLoading(false);
		}
		};
	
	useEffect(() => {
		getCars();
	}, [fuel, limit, year, manufacturer, model]);

	const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars; //check if no cars were returned

	return (
		<main className="overflow-hidden">
			{/* hero section */}
			<Hero />
			<div className="mt-12 padding-x padding-y max-width" id="discover">
				<div className="home__text-container">
					<h1 className="text-4xl font-extrabold">Garage Catalogue</h1>
					<p>Cars we have fixed</p>
				</div>

				<div className="home__filters">
					<SearchBar setManufacturer={setManufacturer} setModel={setModel} />

					<div className="home__filter-container">
						<CustomFilter setFilter={setFuel} title="fuel" options={fuels} />
						<CustomFilter setFilter={setYear} title="year" options={yearsOfProduction} />
					</div>
				</div>

				{/* display cars from the car ninjas api */}
				{allCars.length>0 ? (
					<section>
						<div className="home__cars-wrapper">
							{allCars?.map((car) => (
								<CarCard car={car} />
							))}
						</div>
						{loading && (
							// <div className="mt-16 w-full flex-center">
							// 	<Image
							// 	src="/loader.svg"
							// 	alt="loader"
							// 	width={50}
							// 	height={50}
							// 	className="object-contain"
							// 	/>
							// </div>
							// <BeatLoader/>
							<p>Cars are loading.Please Wait</p>
						)}
						<ShowMore
							pageNumber={limit / 10}
							isNext={limit> allCars.length}
							setLimit={setLimit}
						/>
					</section>
				) : (
					<div className="home__error-container">
						<h2 className="text-black text-xl font-bold">Oops,No Results</h2>
					</div>
				)}
			</div>
		</main>
	);
};

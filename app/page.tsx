/** @format */

import CarCard from "@/components/CarCard";
import CustomFilter from "@/components/CustomFilter";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { fetchCars } from "@/utils";
import Image from "next/image";

export default async function Home() {
	// fetch all cars
	const allCars = await fetchCars();
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
					<SearchBar />

					<div className="home__filter-container">
						<CustomFilter title="fuel" />
						<CustomFilter title="year" />
					</div>
				</div>

				{/* display cars from the car ninjas api */}
				{!isDataEmpty ? (
					<section>
						<div className="home__cars-wrapper">
							{allCars?.map((car) => (
								<CarCard car={car} />
							))}
						</div>
					</section>
				) : (
					<div className="home__error-container">
						<h2 className="text-black text-xl font-bold">Oops,No Results</h2>
						<p>{allCars?.message}</p>
					</div>
				)}
			</div>
		</main>
	);
}

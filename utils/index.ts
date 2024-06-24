/** @format */

import { carProps } from "@/types";

export async function fetchCars() {
	const headers = {
		"x-rapidapi-key": "7d1e92351dmshe786ad9a57d7051p147190jsn13457f868a93",
		"x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
	};

	const response = await fetch(
		"https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=gt",
		{ headers: headers },
	);
	const result = await response.json();
	return result;
}

export const calculateCarRent = (city_mpg: number, year: number) => {
	const basePricePerDay = 50; // Base rental price per day in dollars
	const mileageFactor = 0.1; // Additional rate per mile driven
	const ageFactor = 0.05; // Additional rate per year of vehicle age

	// Calculate additional rate based on mileage and age
	const mileageRate = city_mpg * mileageFactor;
	const ageRate = (new Date().getFullYear() - year) * ageFactor;

	// Calculate total rental rate per day
	const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

	return rentalRatePerDay.toFixed(0);
};


export const generateCarImageUrl=(car:carProps,angle?:string)=>{
    
}
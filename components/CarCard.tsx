/** @format */

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { carProps } from "@/types";
import CustomButton from "./CustomButton";
import { calculateCarRent, generateCarImageUrl } from "@/utils";
import CarDetails from "./CarDetails";

interface carCardProps {
	car: carProps;
}

const CarCard = ({ car }: carCardProps) => {
	const { city_mpg, year, make, model, transmission, drive } = car;
	const carRent = calculateCarRent(city_mpg, year);
    const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="car-card group">
			{/* car name and renting price */}
			<div className="car-card__content">
				<h2 className="car-card__content-title">
					{make} {model}
				</h2>
			</div>
			<p className="flex mt-6 text-[32px] font-extrabold">
				<span className="self-start text-[14px] font-semibold">KES</span>
				{carRent}
				<span className="self-end text-[14px] font-medium">/day</span>
			</p>

			{/* car image */}
			<div className="relative w-full h-40 my-3 object-contain">
				<Image
					src={generateCarImageUrl(car)}
					alt="car model"
					fill
					priority
					className="object-contain"
				/>
			</div>

			{/* transmission type */}
			<div className="relative flex w-full mt-2 ">
				<div className="flex group-hover:invisible w-full justify-between text-gray">
					<div className="flex flex-col justify-center items-center gap-2">
						<Image
							src="/steering-wheel.svg"
							width={20}
							height={20}
							alt="steering wheel"
						/>
						<p className="text-[14px]">
							{transmission === "a" ? "Automatic" : "Manual"}
						</p>
					</div>

					{/* fwd,rwd or 4wd */}
					<div className="flex flex-col justify-center items-center gap-2">
						<Image src="/tire.svg" width={20} height={20} alt="tire" />
						<p className="text-[14px]">{drive.toUpperCase()}</p>
					</div>

					{/* fuel consumption in miles per galon within a given city */}
					<div className="flex flex-col justify-center items-center gap-2">
						<Image src="/gas.svg" width={20} height={20} alt="steering wheel" />
						<p className="text-[14px]">{city_mpg} MPG</p>
					</div>
				</div>

                {/* book service button */}
                <div className="car-card__btn-container">
                    <CustomButton title="Book Service" containerStyles="w-full py-[16px] rounded-full bg-primary-blue" textStyles="text-white text-[14px] leading-[17px] font-bold"
                    rightIcon="/right-arrow.svg"
                    handleClick={()=>setIsOpen(true)}/>
                </div>
			</div>

            <CarDetails isOpen={isOpen} closeModal={()=>{setIsOpen(false)}} car={car}/>
		</div>
	);
};

export default CarCard;

/** @format */

"use client";
import React from "react";
import Image from "next/image";
import CustomButton from "./CustomButton";

const Hero = () => {
	const handleScroll = () => {};
	return (
		<div className="hero">
			<div className="flex-1 pt-36 padding-x">
				<h1 className="hero__title">Fix or Maintain your cars!</h1>
				<p className="hero__subtitle">
					Keep your car in check with the help of our professional Mechanics.
				</p>
				<CustomButton
					title="View Services"
					containerStyles="bg-primary-blue text-white rounded-full mt-10"
					handleClick={handleScroll}
				/>
			</div>

			{/* car image */}
			<div className="hero__image-container">
				<div className="hero__image">
					<Image src="/hero.png" alt="hero" fill className="object-contain" />
				</div>
				<div className="hero__image-overlay" />
			</div>
		</div>
	);
};

export default Hero;

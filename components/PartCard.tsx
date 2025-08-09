"use client";

import React, { useState } from "react";
import Image from "next/image";
import CustomButton from "./CustomButton";
import OrderForm from "./OrderForm";

interface PartCardProps {
  part: {
    _id: string;
    title: string;
    description: string;
    price: number;
    inStock: boolean;
    brand: string;
    model: string;
    category: string;
    images: string[];
  };
}

const PartCard = ({ part }: PartCardProps) => {
  const { title, price, description, brand, model, category, inStock, images } = part;
  const [openModal, setOpenModal] = useState(false); 

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-50 border-b border-gray-100">
        {images?.[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col px-6 py-5 gap-4">
        {/* Title */}
        <h3 className="text-lg font-semibold uppercase text-gray-800 tracking-wide leading-tight">
          {title}
        </h3>

        {/* Price & Stock */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-xl font-bold text-primary-blue">
              KES {price?.toLocaleString()}
            </p>
          </div>
          <div className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <hr className="border-t border-gray-100" />

        {/* Specs */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-700">Brand:</span> {brand || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Model:</span> {model || "—"}
          </div>
          <div className="col-span-2">
            <span className="font-medium text-gray-700">Category:</span> {category || "—"}
          </div>
        </div>

        <hr className="border-t border-gray-100" />

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Button */}
        <div className="pt-3">
          <CustomButton
            title="Order Now"
            containerStyles={`w-full py-3 rounded-full text-white font-bold ${
              part.inStock ? "bg-primary-blue hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            handleClick={() => {
              if (!part.inStock) return;
              setOpenModal(true);
            }}
            btnType="button"
          />

          <OrderForm
            partId={part._id}
            partTitle={part.title}
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default PartCard;

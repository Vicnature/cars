"use client";

import { useState, useEffect } from "react";
import { fetchSpareParts } from "@/utils/fetchSpareParts";
import CustomButton from "@/components/CustomButton";
import PartCard from "@/components/PartCard";

export default function Home() {
  const [allParts, setAllParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getParts = async () => {
    setLoading(true);
    try {
      const parts = await fetchSpareParts();
      setAllParts(parts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getParts();
  }, []);

  const isDataEmpty = !Array.isArray(allParts) || allParts.length < 1;

  return (
    <main className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Garage Spare Parts Catalogue</h1>
          <p>Spare parts available at Garage Kenya</p>
        </div>

        {/* You can add filters/search here if you want */}

        {isDataEmpty ? (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, No Results</h2>
          </div>
        ) : (
          <section>
            <div className="home__cars-wrapper">
              {allParts.map((part) => (
                <PartCard key={part._id} part={part} />
              ))}
            </div>
            {loading && <p>Loading spare parts, please wait...</p>}
          </section>
        )}
      </div>
    </main>
  );
}

// Minimal PartCard component to show spare parts info
// function PartCard({ part }) {
//   return (
//     <div className="car-card group">
//       <div className="car-card__content">
//         <h2 className="car-card__content-title">{part.title}</h2>
//       </div>
//       <p className="flex mt-6 text-[32px] font-extrabold">
//         <span className="self-start text-[14px] font-semibold">KES</span>
//         {part.price}
//       </p>

//       <div className="relative w-full h-40 my-3 object-contain">
//         {part.images?.[0] ? (
//           <img
//             src={part.images[0]}
//             alt={part.title}
//             className="object-contain w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//             <span>No image</span>
//           </div>
//         )}
//       </div>

//       <p className="text-gray-600">{part.description}</p>
//       <p className="mt-2 font-semibold">
//         Brand: {part.brand} | Model: {part.model} | Category: {part.category}
//       </p>
//       <p className="mt-1">
//         {part.inStock ? (
//           <span className="text-green-600 font-semibold">In Stock</span>
//         ) : (
//           <span className="text-red-600 font-semibold">Out of Stock</span>
//         )}
//       </p>

//       <CustomButton
//         title="Order Now"
//         containerStyles="w-full py-[16px] rounded-full bg-primary-blue mt-4"
//         textStyles="text-white font-bold"
//         handleClick={() => alert(`Order placed for ${part.title}!`)}
//       />
//     </div>
//   );
// }

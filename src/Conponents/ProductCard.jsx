import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ products, categoryName }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="my-4 mx-[5vw] sm:mx-[10vw] lg:mx-[5vw] shadow-xl p-5 py-6 rounded-xl bg-white">

      <div className="flex justify-between items-center  mb-4">
        <h1 className="text-xl font-semibold">{categoryName}</h1>
        <button className="px-4 py-2 bg-[#167389] text-white rounded-md hover:bg-[#347e8f]">View More</button>
      </div>
      <div className="grid grid-cols-1  sm:grid-cols-2  lg:grid-cols-4  xl:grid-cols-5 gap-6">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={item.image}
                alt={item.name}
              />
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.shortDescription}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold">${item.price}</span>
                <button className="text-[#167389] hover:text-[#135a6e] text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;

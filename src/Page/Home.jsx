import React from 'react'
import Banner from '../Conponents/Banner'
import { HeartIcon } from '@heroicons/react/24/outline';


const Home = () => {

  const wishlistItems = [
    {
      id: 1,
      name: "Store Heavyweight Hoodies",
      variant: "Mr. Black",
      price: 50,
      rating: 4.2,
      reviewCount: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Alarm Golly",
      variant: "Blue",
      price: 50,
      rating: 4.2,
      reviewCount: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Auto Body",
      variant: "White",
      price: 50,
      rating: 4.2,
      reviewCount: 12,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 4,
      name: "Lancelto",
      variant: "Black",
      price: 50,
      rating: 4.2,
      reviewCount: 12,
      image: "https://via.placeholder.com/150"
    }
  ];



  return (
    <div>
      <Banner></Banner>
         {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id + 10} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  <p className="text-gray-500 text-sm">{item.variant}</p>
                  
                  <div className="mt-2 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 text-xs ml-1">
                      ({item.reviewCount})
                    </span>
                  </div>
                  
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
    </div>
  )
}

export default Home

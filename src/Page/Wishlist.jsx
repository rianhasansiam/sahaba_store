import React from 'react';
import { HeartIcon, ShoppingCartIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">


        {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900">WISHLIST</h1>
          
 

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Wishlist ({wishlistItems.length})</h2>
                <button className="text-[#167389] hover:text-[#135a6e] flex items-center">
                  Move all to cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        className="h-32 w-32 rounded-md object-cover"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="ml-0 sm:ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-500">{item.variant}</p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <HeartIcon className="h-6 w-6" />
                        </button>
                      </div>
                      
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
                        <span className="text-gray-500 text-sm ml-1">
                          {item.rating} ({item.reviewCount})
                        </span>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold">${item.price}</span>
                        <button className="bg-[#167389] hover:bg-[#135a6e] text-white px-4 py-2 rounded-md flex items-center">
                          Add to Cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (2 items)</span>
                  <span className="font-medium">$100</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg">$100</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Taxes and shipping calculated at checkout
                </div>
                
                <button className="w-full bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium flex items-center justify-center">
                  Continue to Checkout <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
                
                <div className="flex justify-center mt-4">
                  <a href="#" className="text-[#167389] hover:text-[#135a6e] flex items-center">
                    Continue Shopping <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default Wishlist;
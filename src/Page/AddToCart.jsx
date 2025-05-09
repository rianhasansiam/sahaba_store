import React from 'react';
import { ChevronRightIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const AddToCart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Slim Fit Casual Shirt",
      description: "Button-Down Collar & Placket...",
      size: "XL",
      color: "Marron",
      price: 85,
      originalPrice: 92,
      quantity: 1,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Printed Straight Kurtas",
      description: "Digital Printed With Yoke Embroidered...",
      size: "XL",
      color: "Green",
      price: 68,
      originalPrice: 76,
      quantity: 1,
      image: "https://via.placeholder.com/150"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 35.52;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HOPY</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-[#167389]">Home</a>
            <a href="#" className="text-gray-600 hover:text-[#167389]">Best Seller</a>
            <a href="#" className="text-gray-600 hover:text-[#167389]">New Arrival</a>
            <a href="#" className="text-gray-600 hover:text-[#167389]">Collection</a>
            <a href="#" className="text-gray-600 hover:text-[#167389]">Hi, John</a>
          </nav>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span className="text-[#167389]">Cart</span>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span>Checkout</span>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Your Cart ({cartItems.length})</h2>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
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
                          <p className="text-gray-500 text-sm">{item.description}</p>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Size: {item.size}</span>
                            <span className="mx-2">|</span>
                            <span className="text-gray-600">Color: {item.color}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <button className="border border-gray-300 rounded-l-md px-3 py-1">
                            -
                          </button>
                          <span className="border-t border-b border-gray-300 px-4 py-1">
                            {item.quantity}
                          </span>
                          <button className="border border-gray-300 rounded-r-md px-3 py-1">
                            +
                          </button>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="text-[#167389] hover:text-[#135a6e] flex items-center">
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium mt-4">
                  Proceed to Checkout
                </button>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  Estimated Delivery by {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Have a Coupon?</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#167389] focus:border-[#167389]"
                  />
                  <button className="bg-[#167389] hover:bg-[#135a6e] text-white px-4 py-2 rounded-r-md">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
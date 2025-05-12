import React, { useContext, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { contextData } from '../Contex';
import { toast } from 'react-toastify';

const AddtocartProduct = ({ item,refetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 const {userData}=useContext(contextData)



  const handleRemove = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
     const response = await axios.delete('http://localhost:5000/remove-from-cart', {
        data: {
          email: userData?.email,  // Replace with the user's email
          productId: id,  // Pass the product ID to remove
        },
      });

      // Check the success message in the response
      if (response.data.message) {
        refetch()
       toast.success("Item successfully removed from cart.");
        // Handle success, such as updating the UI or state
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Error removing item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 flex flex-col sm:flex-row">
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
            <p className="text-gray-500 text-sm">{item.shortDescription}</p>
            {item.availableAmount && (
              <div className="mt-2 text-sm text-gray-600">
                Available: {item.availableAmount}
              </div>
            )}
          </div>
          <button
            className="text-gray-400 hover:text-red-500"
            onClick={() => handleRemove(item._id)}  // Call the handleRemove function on click
            disabled={isLoading}  // Disable the button while the request is in progress
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <button className="border border-gray-300 rounded-l-md px-3 py-1">-</button>
            <span className="border-t border-b border-gray-300 px-4 py-1">
              {item.quantity || 1}
            </span>
            <button className="border border-gray-300 rounded-r-md px-3 py-1">+</button>
          </div>

          <div className="flex items-center">
            <span className="text-lg font-bold">${(item.price || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddtocartProduct;

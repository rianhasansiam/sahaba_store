import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFetchData } from '../hooks/useFetchData';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { contextData } from '../Contex';
import api from '../hooks/api';

const WishlishtEachcard = ({ id, setreload, reload }) => {
    const {userData} =useContext(contextData)
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(['eachproduct', id], `/eachproduct/${id?.productId}`, {
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-4">Error: {error.message}</p>;
  }



  // Handle remove to Wishlist
  const handleRemoveToWishlist = async (productId) => {
    if (!userData?.email) {
      return toast.warn("Please log in first");
    }

    try {
        const response = await api.put("/remove-from-wishlist", {
        email: userData.email,
        productId: productId,
      });
    setreload(!reload)
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
};



  return (
    <div className="py-6 flex flex-col sm:flex-row border-b">
      <div className="flex-shrink-0 mb-4 sm:mb-0">
        <img
          className="h-32 w-32 rounded-md object-cover"
          src={product?.image}
          alt={product?.name}
        />
      </div>
      <div className="ml-0 sm:ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product?.name}</h3>
            <p className="text-gray-500">{product?.shortDescription}</p>
          </div>
          <button onClick={()=>handleRemoveToWishlist(id?.productId)} className=" text-red-500">
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">${product?.price}</span>
          <button className="bg-[#167389] hover:bg-[#135a6e] text-white px-4 py-2 rounded-md flex items-center">
            Add to Cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

WishlishtEachcard.propTypes = {
  id: PropTypes.string.isRequired,
};

export default WishlishtEachcard;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { contextData } from "../Contex";
import api from "../hooks/api";
import { toast } from "react-toastify";

const ProductCard = ({ products, categoryName }) => {
  const { userData } = useContext(contextData);
  const [wishlist, setWishlist] = useState({}); // Store wishlist as object with product IDs

  useEffect(() => {
    const wishlistFromStorage = JSON.parse(localStorage.getItem("wishlist")) || {};
    setWishlist(wishlistFromStorage);
  }, []);

  const handleAddtoCart = async (productId) => {
    if (!userData?.email) {
      return toast.error("Please log in first");
    }

    try {
      const response = await api.put("/add-to-cart", {
        email: userData.email,
        productId: productId,
      });

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!userData?.email) {
      return toast.warn("Please log in first");
    }

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    const isInWishlist = storedWishlist[productId];

    if (isInWishlist) {
      // REMOVE from wishlist
      try {
        const response = await api.put("/remove-from-wishlist", {
          email: userData.email,
          productId,
        });

        const updatedWishlist = { ...storedWishlist };
        delete updatedWishlist[productId];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);

        toast.success(response.data.message || "Removed from wishlist");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error(
          error.response?.data?.message || "Failed to remove from wishlist"
        );
      }
    } else {
      // ADD to wishlist
      try {
        const response = await api.put("/add-to-wishlist", {
          email: userData.email,
          productId,
        });

        const updatedWishlist = {
          ...storedWishlist,
          [productId]: true,
        };

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);

        toast.success(response.data.message || "Added to wishlist");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error(
          error.response?.data?.message || "Failed to add to wishlist"
        );
      }
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="my-4 mx-[5vw] sm:mx-[10vw] lg:mx-[5vw] shadow-xl p-5 py-6 rounded-xl bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{categoryName}</h1>
        <button className="px-4 py-2 bg-[#167389] text-white rounded-md hover:bg-[#347e8f]">
          View More
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((item) => (
          <div
            key={item?._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={item?.image}
                alt={item?.name}
              />

              <button
                onClick={() => handleAddToWishlist(item?._id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                {wishlist[item._id] ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900">{item?.name}</h3>
              <p className="text-gray-500 text-sm">{item?.shortDescription}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold">${item.price}</span>
                <button
                  onClick={() => handleAddtoCart(item?._id)}
                  className="text-[#167389] hover:text-[#135a6e] text-sm font-medium"
                >
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

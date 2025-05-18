import React, { useContext, useEffect, useState } from "react";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { contextData } from "../Contex";
import { toast } from "react-toastify";
import api from "../hooks/api";
import { useNavigate } from "react-router-dom";

// Utility to remove null/undefined values from an object
function removeNulls(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}

const HomepageCard = ({ product }) => {
  const navigate = useNavigate();
  const { userData, searchTerm } = useContext(contextData);
  const [wishlist, setWishlist] = useState({});

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const wishlistFromStorage = JSON.parse(localStorage.getItem("wishlist")) || {};
    setWishlist(wishlistFromStorage);
  }, []);

  const handleAddtoCart = async (productId) => {
    const pid = typeof productId === 'string' ? productId : String(productId || '');
    const cart = JSON.parse(localStorage.getItem("addtocart")) || {};
    if (cart[pid]) {
      toast.info("Already product add to cart");
      return;
    }
    const payload = removeNulls({
      email: userData?.email,
      productId: pid,
    });
    try {
      // Always update localStorage
      cart[pid] = 1;
      localStorage.setItem("addtocart", JSON.stringify(cart));
      // If userData available, sync with backend
      if (userData && userData.email) {
        const response = await api.put("/add-to-cart", payload);
        toast.success(response.data.message || "Added to cart");
      } else {
        toast.success("Added to cart (local only)");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    const isInWishlist = storedWishlist[productId];
    try {
      let updatedWishlist;
      if (isInWishlist) {
        // Remove from wishlist (local)
        updatedWishlist = { ...storedWishlist };
        delete updatedWishlist[productId];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        // If userData available, sync with backend
        if (userData && userData.email) {
          const payload = removeNulls({ email: userData.email, productId });
          await api.put("/remove-from-wishlist", payload);
        }
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist (local)
        updatedWishlist = { ...storedWishlist, [productId]: true };
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        // If userData available, sync with backend
        if (userData && userData.email) {
          const payload = removeNulls({ email: userData.email, productId });
          await api.put("/add-to-wishlist", payload);
        }
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  // Filter by search term (case-insensitive, name or shortDescription)
  if (searchTerm &&
    !(
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) {
    return null;
  }

  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image with hover effects */}
      <div className="relative group aspect-square">
        <img
          className="w-full h-full object-cover"
          src={product?.image}
          alt={product?.name}
          loading="lazy"
        />
        
        {/* Wishlist button */}
        <button
          onClick={() => handleAddToWishlist(product?._id)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-all"
          aria-label={wishlist[product._id] ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlist[product._id] ? (
            <HeartIconSolid className="h-5 w-5 text-red-500 " />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          )}
        </button>
        
        {/* Quick view overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => handleViewDetails(product?._id)}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div> */}

      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
          {product?.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
          {product?.shortDescription}
        </p>
        
        {/* Price and actions */}
        <div className="mt-auto">
          <span className="font-bold text-sm block mb-3">
            {product.price} BDT
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(product?._id)}
              className="flex-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => handleAddtoCart(product?._id)}
              className="flex-1 text-xs px-3 py-1.5 bg-[#167389] text-white hover:bg-[#135a6e] rounded-md transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageCard;
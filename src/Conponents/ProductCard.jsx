import React, { useContext, useEffect, useState } from "react";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { contextData } from "../Contex";
import { toast } from "react-toastify";
import api from "../hooks/api";
import { useNavigate, useLocation } from "react-router-dom";

// Utility to remove null/undefined values from an object
function removeNulls(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}

const ProductCard = ({ products, categoryName, categoryID }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(contextData);
  const [wishlist, setWishlist] = useState({});

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
    if (isInWishlist) {
      toast.info("Already product add to wishlist");
      return;
    }
    try {
      let updatedWishlist;
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
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="my-4 mx-4 sm:mx-6 lg:mx-8 xl:mx-auto max-w-7xl shadow-lg p-4 sm:p-6 rounded-xl bg-white ">
      <div className="flex  sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{categoryName}</h1>
        {location.pathname === '/' && (
          <button 
            onClick={() => navigate(`/allproduct/${categoryID}`)} 
            className="px-3 sm:px-4 py-1 sm:py-2 bg-[#167389] text-white rounded-md hover:bg-[#347e8f] text-sm sm:text-base"
          >
            View More
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {products.map((item) => (
          <div
            key={item?._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative group aspect-square">
              <img
                className="w-full h-full object-cover"
                src={item?.image}
                alt={item?.name}
                loading="lazy"
              />
              
              {/* Wishlist button */}
              <button
                onClick={() => handleAddToWishlist(item?._id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                aria-label={wishlist[item._id] ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist[item._id] ? (
                  <HeartIconSolid className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
              
              {/* Quick view button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleViewDetails(item?._id)}
                  className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  title="View Details"
                  aria-label="View product details"
                >
                  <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="p-2 sm:p-3 flex-grow flex flex-col">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1 mb-1">{item?.name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">{item?.shortDescription}</p>
              <div className="mt-auto flex flex-col  justify-between items-center">

                <span className="font-bold text-sm sm:text-base">{item.price} BDT</span>

                <div className="flex gap-2 my-3  sm:gap-2 ">
                  <button
                    onClick={() => handleViewDetails(item?._id)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleAddtoCart(item?._id)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-[#167389] text-white hover:bg-[#135a6e] rounded-md whitespace-nowrap"
                  >
                    Add to Cart
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
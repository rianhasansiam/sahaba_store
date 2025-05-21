import React from 'react';
import PropTypes from 'prop-types';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';
import { removeFromWishlist } from '../hooks/wishlistUtils';

const WishlishtEachcard = ({ product, id, setreload, reload }) => {
  if (!product) {
    return <LoadingPage />;
  }
  // Handle remove from Wishlist
  const handleRemoveToWishlist = (productId) => {
    const success = removeFromWishlist(productId);
    if (success) {
      setreload(!reload);
    }
  };

  const handleAddtoCart = (productId) => {
    try {
      // Get current cart
      let cart = JSON.parse(localStorage.getItem("addtocart")) || {};
      
      // Add to cart with default quantity and size
      if (!cart[productId]) {
        cart[productId] = { quantity: 1, size: "250 ml" };
        localStorage.setItem("addtocart", JSON.stringify(cart));
        toast.success("Item added to cart");
      } else {
        toast.info("Item already in cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
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
          <button 
            onClick={() => handleRemoveToWishlist(id?.productId || id)} 
            className="text-red-500"
          >
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">{product?.price} BDT</span>
          <button 
            onClick={() => handleAddtoCart(id?.productId || id)} 
            className="bg-[#22874b] hover:bg-[#135a6e] text-white px-4 py-2 rounded-md flex items-center"
          >
            Add to Cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

WishlishtEachcard.propTypes = {
  product: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setreload: PropTypes.func.isRequired,
  reload: PropTypes.bool
};

export default WishlishtEachcard;

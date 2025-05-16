import React, { useEffect, useState } from 'react';
import { HeartIcon, ShoppingCartIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useFetchData } from '../hooks/useFetchData';
import WishlistCard from '../Conponents/WishlistCard';
import api from '../hooks/api';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [reload, setReload] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { 
    data: user, 
    refetch
  } = useFetchData('posts', '/allusers', {
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    refetch();
  }, [reload, refetch]);

  // Fetch product info for all wishlist items and calculate subtotal
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (user) {
        setLoadingProducts(true);
        // Flatten all wishlist items from all users
        const allWishlistItems = user.flatMap(eachuser =>
          eachuser?.addToWishlist?.map(item => ({
            ...item,
            userId: eachuser._id // Include user ID for reference
          })) || []
        );
        setWishlistItems(allWishlistItems);
        if (allWishlistItems.length === 0) {
          setSubtotal(0);
          setLoadingProducts(false);
          return;
        }
        // Fetch product info for each wishlist item
        try {
          const productPromises = allWishlistItems.map(item =>
            api.get(`/eachproduct/${item.productId}`)
          );
          const productResponses = await Promise.all(productPromises);
          const products = productResponses.map(res => res.data);
          // Calculate subtotal
          const calculatedSubtotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
          setSubtotal(calculatedSubtotal);
        } catch {
          setSubtotal(0);
        }
        setLoadingProducts(false);
      }
    };
    fetchWishlistProducts();
  }, [user]);

  // Add this function to move all wishlist items to cart
  const handleMoveAllToCart = async () => {
    if (!wishlistItems.length) return;
    setLoadingProducts(true);
    try {
      // Group wishlist items by user email
      const userWishlistMap = {};
      user.forEach(eachuser => {
        if (eachuser?.addToWishlist?.length > 0) {
          userWishlistMap[eachuser.email] = eachuser.addToWishlist.map(item => item.productId || item);
        }
      });
      // For each user, add each product to their cart
      for (const [email, productIds] of Object.entries(userWishlistMap)) {
        // Update localStorage for addtocart only (do not remove from wishlist)
        let localCart = JSON.parse(localStorage.getItem('addtocart')) || [];
        for (const productId of productIds) {
          try {
            await api.put('/add-to-cart', { email, productId });
            // Add to local addtocart if not already present
            if (!localCart.includes(productId)) {
              localCart.push(productId);
            }
          } catch {
            // Optionally, handle error (e.g., product already in cart)
          }
        }
        localStorage.setItem('addtocart', JSON.stringify(localCart));
      }
      setReload(r => !r);
    } catch (err) {
      // Optionally, show error toast
    }
    setLoadingProducts(false);
  };

  // Add this function for Continue to Checkout
  const handleCheckout = async () => {
    await handleMoveAllToCart();
    // Optionally, navigate to cart or checkout page here
  };

  const itemCount = wishlistItems.length;

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
                <h2 className="text-xl font-semibold">Your Wishlist ({itemCount})</h2>
                <button
                  className="text-[#167389] hover:text-[#135a6e] flex items-center"
                  onClick={handleMoveAllToCart}
                  disabled={loadingProducts || !wishlistItems.length}
                >
                  Move all to cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
                </button>
              </div>

              {user?.map((eachuser) => (
                eachuser?.addToWishlist?.length > 0 ? (
                  <WishlistCard 
                    key={eachuser?._id}  
                    eachuser={eachuser}  
                    setReload={setReload} 
                    reload={reload}
                  />
                ) : ''
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{loadingProducts ? 'Loading...' : `$${subtotal.toFixed(2)}`}</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Taxes and shipping calculated at checkout
                </div>
                <button
                  className="w-full bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
                  onClick={handleCheckout}
                  disabled={loadingProducts || !wishlistItems.length}
                >
                  Continue to Checkout <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
                <div className="flex justify-center mt-4">
                  <Link to="/" className="text-[#167389] hover:text-[#135a6e] flex items-center">
                    Continue Shopping <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Link>
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
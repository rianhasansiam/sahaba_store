import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddtocartProduct from '../Conponents/AddtocartProduct';
import { toast } from 'react-toastify';
import { contextData } from '../Contex';

const AddToCart = () => {
  const navigate = useNavigate();
  const { setCheckoutProducts, setFinalPrice } = useContext(contextData);
  const [cartItems, setCartItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');  useEffect(() => {
    // Get cart items from local storage
    const storedCart = JSON.parse(localStorage.getItem('addtocart')) || {};
    setCartItems(storedCart);
    setLoading(false);
    
    // Calculate total price
    calculateTotal(storedCart);

    // Fetch available coupons
    fetchCoupons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Fetch coupons from API
  const fetchCoupons = async () => {
    try {
      const response = await fetch('https://sahaba-store-server.vercel.app/coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };
  // Calculate total price from cart items
  const calculateTotal = (items) => {
    const subtotal = Object.values(items).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    // Apply discount if coupon is applied
    const total = subtotal - discount;
    setTotalPrice(total > 0 ? total : 0);
    return total > 0 ? total : 0;
  };

  // Apply coupon code
  const applyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const foundCoupon = coupons.find(coupon => 
      coupon.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (!foundCoupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (foundCoupon.status !== 'active') {
      setCouponError('This coupon is not active');
      return;
    }

    // Calculate subtotal to check minimum order
    const subtotal = Object.values(cartItems).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);

    if (subtotal < foundCoupon.minOrder) {
      setCouponError(`Minimum order amount for this coupon is $${foundCoupon.minOrder}`);
      return;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (foundCoupon.type === 'fixed') {
      discountAmount = foundCoupon.discount;
    } else if (foundCoupon.type === 'percentage') {
      discountAmount = subtotal * (foundCoupon.discount / 100);
    }    setAppliedCoupon(foundCoupon);
    setDiscount(discountAmount);
    toast.success('Coupon applied successfully!');
    
    // Update the total price with the discount
    const updatedTotal = subtotal - discountAmount;
    setTotalPrice(updatedTotal > 0 ? updatedTotal : 0);
  };
  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    
    // Recalculate the total without discount
    const subtotal = Object.values(cartItems).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    setTotalPrice(subtotal);
    
    toast.info('Coupon removed');
  };
  // Update cart when quantity or variant changes
  const updateCart = (productId, updates) => {
    const updatedCart = { ...cartItems };
    
    // Update the specific product with new data
    updatedCart[productId] = {
      ...updatedCart[productId],
      ...updates
    };
    
    // Save to local storage
    localStorage.setItem('addtocart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Recalculate subtotal
    const subtotal = Object.values(updatedCart).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    // Apply discount if coupon is applied
    const total = subtotal - discount;
    setTotalPrice(total > 0 ? total : 0);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Cart updated successfully');
  };
  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[productId];
    
    localStorage.setItem('addtocart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Recalculate subtotal
    const subtotal = Object.values(updatedCart).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    // Apply discount if coupon is applied
    const total = subtotal - discount;
    setTotalPrice(total > 0 ? total : 0);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Item removed from cart');
  };

  // Clear entire cart
  const clearCart = () => {
    localStorage.setItem('addtocart', JSON.stringify({}));
    setCartItems({});
    setTotalPrice(0);
    setAppliedCoupon(null);
    setDiscount(0);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Cart cleared');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      
      {Object.keys(cartItems).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="bg-[#22874b] text-white py-3 px-6 rounded-md hover:bg-[#1e463e] transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {Object.entries(cartItems).map(([id, item]) => (
              <AddtocartProduct 
                key={id}
                productId={id}
                product={item}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            ))}
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
              <Link 
                to="/products" 
                className="text-[#22874b] hover:text-blue-800 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(totalPrice + discount).toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove coupon
                    </button>
                  </>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Coupon Code Section */}
              {!appliedCoupon && (
                <div className="mb-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-[#22874b] text-white px-4 py-2 rounded-r-md hover:bg-[#1e463e] transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-1 text-sm text-red-600">{couponError}</p>
                  )}
                </div>
              )}
                <button                onClick={() => {
                  // Convert cart items to array for checkout
                  const products = Object.entries(cartItems).map(([id, item]) => ({
                    id: id,
                    productId: item.productId || id,
                    name: item.name,
                    price: Number(item.price),
                    quantity: item.quantity,
                    image: item.thumbnail,
                    totalPrice: Number(item.price) * item.quantity
                  }));
                    // Calculate the final price (with discount applied)
                  const finalCheckoutPrice = totalPrice;
                  
                  // Update context with cart items and total price along with coupon info
                  setCheckoutProducts(products);
                  setFinalPrice(finalCheckoutPrice);
                  
                  // Add coupon information to localStorage if a coupon is applied
                  if (appliedCoupon) {
                    localStorage.setItem('appliedCoupon', JSON.stringify({
                      code: appliedCoupon.code,
                      discount: discount,
                      type: appliedCoupon.type
                    }));
                  } else {
                    localStorage.removeItem('appliedCoupon');
                  }
                  
                  // Navigate to checkout
                  navigate('/checkout');
                }}
                className="w-full bg-[#22874b] text-white py-3 px-4 rounded-md font-medium text-center block hover:bg-[#1e463e] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
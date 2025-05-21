import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { contextData } from "../Contex";
import { useFetchData } from "../hooks/useFetchData";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import AddtocartProduct from "../Conponents/AddtocartProduct";
import RecommendedProducts from "../Conponents/RecommendedProducts";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import LoadingPage from "../Conponents/LoadingPage";

// Constants
const CART_STORAGE_KEY = "addtocart";
const MAX_QUANTITY = 100;

// Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount);
};


const AddToCart = () => {
  const { setFinalPrice, setCheckoutProducts, clearCart } = useContext(contextData);
  const navigate = useNavigate();

  // State
  const [cartQuantities, setCartQuantities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
    } catch (error) {
      console.error("Error parsing cart data from localStorage", error);
      return {};
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  // Track if there are any unsaved changes to the cart items
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Data fetching
  const { data: productsData, error: productsError } = useFetchData("products", "/products");
  const { data: coupons, error: couponsError } = useFetchData("coupons", "/coupons");

  // Update cart items when quantities or products data changes
  useEffect(() => {
    if (productsError) {
      setError(productsError);
      setIsLoading(false);
      return;
    }

    if (productsData) {
      try {
        const cartItemIds = Object.keys(cartQuantities);
        const items = [];
        let cartNeedsUpdate = false;
        let updatedCartQuantities = {...cartQuantities};
        
        cartItemIds.forEach(id => {
          const product = productsData.find(p => p._id === id);
          if (product) {
            // Check if quantity exceeds available inventory
            const currentQuantity = cartQuantities[id]?.quantity || 1;
            
            // If product has inventory tracking and quantity exceeds it
            if (product.availableAmount !== undefined && 
                currentQuantity > product.availableAmount) {
              
              // Adjust quantity to available amount
              const newQuantity = Math.max(1, product.availableAmount);
              updatedCartQuantities[id] = {
                ...cartQuantities[id],
                quantity: newQuantity
              };
              cartNeedsUpdate = true;
              
              // Add with adjusted quantity
              items.push({
                ...product,
                cartQuantity: {
                  ...cartQuantities[id],
                  quantity: newQuantity
                }
              });
              
              // Notify user of adjustment
              if (product.availableAmount <= 0) {
                toast.warn(`${product.name} is out of stock and will be removed from your cart`);
              } else {
                toast.info(`${product.name} quantity adjusted to ${newQuantity} (available stock)`);
              }
            } else {
              // Add product with current quantity
              items.push({
                ...product,
                cartQuantity: cartQuantities[id]
              });
            }
          }
        });
        
        // Update cart quantities in state and localStorage if needed
        if (cartNeedsUpdate) {
          setCartQuantities(updatedCartQuantities);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCartQuantities));
        }
        
        setCartItems(items);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to process cart items");
        console.error("Error processing cart items:", error);
        setIsLoading(false);
      }
    }
  }, [cartQuantities, productsData, productsError]);
  // Generate recommended products based on cart items
  useEffect(() => {
    if (productsData && cartItems.length > 0) {
      try {
        // Get categories of items in cart
        const cartCategories = cartItems
          .map(item => item.category?._id || item.category)
          .filter(Boolean);
        
        // Find products in the same categories but not in cart
        const cartItemIds = cartItems.map(item => item._id);
        let recommendations = productsData.filter(product => 
          !cartItemIds.includes(product._id) && 
          (cartCategories.includes(product.category?._id) || cartCategories.includes(product.category))
        );
        
        // If not enough recommendations from the same category, add some popular/random products
        if (recommendations.length < 3) {
          const otherProducts = productsData.filter(product => 
            !cartItemIds.includes(product._id) && 
            !recommendations.some(rec => rec._id === product._id)
          );
          
          // Shuffle and take a few
          recommendations = [
            ...recommendations,
            ...otherProducts.sort(() => 0.5 - Math.random()).slice(0, 4 - recommendations.length)
          ];
        }
        
        // Limit to 4 recommendations
        setRecommendedProducts(recommendations.slice(0, 4));
      } catch (error) {
        console.error("Error generating recommendations:", error);
      }
    } else {
      setRecommendedProducts([]);
    }
  }, [productsData, cartItems]);

  // Update localStorage when cart changes (debounced)
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartQuantities));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [cartQuantities]);

  // Check for unsaved changes when cart quantities change
  useEffect(() => {
    if (!isInitialRender.current) {
      setHasUnsavedChanges(true);
      
      // Auto-save after 3 seconds of inactivity
      const autoSaveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartQuantities));
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error("Error auto-saving cart to localStorage:", error);
        }
      }, 3000);
      
      return () => clearTimeout(autoSaveTimeout);
    }
  }, [cartQuantities]);

  // Handlers
  const handleQuantityChange = (id, newValues) => {
    // Check if newValues is an object with quantity and size
    const quantity = typeof newValues === 'object' ? newValues.quantity : newValues;
    
    if (quantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    if (quantity > MAX_QUANTITY) {
      toast.error(`Maximum quantity is ${MAX_QUANTITY}`);
      return;
    }
    
    // Check against product inventory
    const product = cartItems.find(item => item._id === id);
    if (product && product.availableAmount && quantity > product.availableAmount) {
      toast.error(`Only ${product.availableAmount} items available in stock`);
      return;
    }

    setCartQuantities(prev => ({
      ...prev,
      [id]: newValues, // Store the entire object with quantity and size
    }));
  };

  const handleDelete = (id) => {
    setCartQuantities(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    toast.success("Item removed from cart");
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    setAppliedCoupon(null);
    setDiscountAmount(0);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (couponsError) {
      setCouponError("Failed to load coupons. Please try again later.");
      return;
    }

    if (!coupons || coupons.length === 0) {
      setCouponError("No coupons available.");
      return;
    }

    const found = coupons.find(
      (c) => c.code === couponCode.trim() // Case-sensitive match
    );

    if (!found) {
      setCouponError("Coupon not found.");
      toast.error("Coupon not found.");
      return;
    }

    if (found.status !== "active") {
      setCouponError("Coupon is not active.");
      toast.error("Coupon is not active.");
      return;
    }

    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order for this coupon is ${formatCurrency(found.minOrder)}`);
      toast.error(`Minimum order for this coupon is ${formatCurrency(found.minOrder)}`);
      return;
    }

    // Calculate discount
    let discount = 0;
    if (found.type === "fixed") {
      discount = Math.min(found.discount, subtotal); // Prevent negative total
    } else if (found.type === "percentage" || found.type === "percent") {
      discount = subtotal * (found.discount / 100);
    }

    setAppliedCoupon(found);
    setDiscountAmount(discount);
    setCouponCode(""); // Clear input after successful application
    toast.success("Coupon applied!");
  };
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Filter out items with zero inventory
    const validItems = cartItems.filter(item => 
      item.availableAmount === undefined || item.availableAmount > 0
    );
    
    // If some items were removed due to inventory constraints
    if (validItems.length < cartItems.length) {
      const removedItems = cartItems.filter(item => 
        item.availableAmount !== undefined && item.availableAmount <= 0
      );
      
      // Create a new cart without the out-of-stock items
      const updatedCart = { ...cartQuantities };
      removedItems.forEach(item => {
        delete updatedCart[item._id];
      });
      
      // Update cart state
      setCartQuantities(updatedCart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      
      // Notify the user
      toast.warn(`${removedItems.length} out-of-stock ${removedItems.length === 1 ? 'item was' : 'items were'} removed from your cart`);
      
      // Update items list
      setCartItems(validItems);
      
      // If no valid items left, stop the checkout process
      if (validItems.length === 0) {
        return;
      }
    }

    const checkoutProductsArr = validItems.map(item => {
      const cartItem = cartQuantities[item._id];
      const size = cartItem?.size || "250 ml";
      const quantity = cartItem?.quantity || 1;
      const basePrice = typeof item.price === "number" ? item.price : Number(item.price) || 0;
      
      // Calculate size-adjusted price
      const adjustedPrice = getPriceBasedOnSize(basePrice, size, 1); // Per unit price with size adjustment
      
      return {
        image: item.image,
        price: adjustedPrice, // Size-adjusted price per unit
        productId: item.productId || item._id,
        name: item.name,
        quantity: quantity,
        size: size,
        totalPrice: adjustedPrice * quantity // Total price for this item
      };
    });

    setCheckoutProducts(checkoutProductsArr);
    
    // Redirect to checkout page
    navigate('/checkout');
  };

  // Helper function to calculate price based on size
  const getPriceBasedOnSize = (basePrice, size, qty) => {
    const price = parseFloat(basePrice);
    if (!price) return 0;
    
    let multiplier = 1;
    switch(size) {
      case "500 ml":
        multiplier = 1.8; // 80% more for double size
        break;
      case "1000 ml":
        multiplier = 3; // 3x price for 1 liter
        break;
      default: // 250 ml
        multiplier = 1;
    }
    
    return price * multiplier * qty;
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      try {
        const cartItem = cartQuantities[item._id];
        const quantity = cartItem?.quantity || 1;
        const size = cartItem?.size || "250 ml";
        const price = typeof item.price === "number" 
          ? item.price 
          : Number(item.price) || 0;
        
        return sum + getPriceBasedOnSize(price, size, quantity);
      } catch (error) {
        console.error("Error calculating price for item:", item, error);
        return sum;
      }
    }, 0);
  }, [cartItems, cartQuantities]);

  const total = Math.max(0, subtotal - discountAmount); // Ensure total doesn't go negative

  // Update final price in context
  useEffect(() => {
    if (!isNaN(total) && total >= 0) {
      setFinalPrice(total);
    }  }, [total, setFinalPrice]);

  // Add keyboard shortcut to save cart changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Command+S to save cart changes
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); // Prevent browser save dialog
        
        if (hasUnsavedChanges) {
          try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartQuantities));
            setHasUnsavedChanges(false);
            toast.success("All cart changes saved");
          } catch (error) {
            console.error("Error saving cart:", error);
            toast.error("Failed to save cart changes");
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartQuantities, hasUnsavedChanges]);

  if (isLoading) return <LoadingPage />;
  if (error) return <div className="min-h-screen flex items-center justify-center">
    <p className="text-red-500 text-lg">Error: {error}</p>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 mb-8">
          <span className="text-[#22874b]">Cart</span>
          <ChevronRightIcon className="h-4 w-4 mx-2" aria-hidden="true" />
          <span>Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Cart ({cartItems.length})</h2>
                {hasUnsavedChanges && (
                  <div className="text-amber-600 text-sm bg-amber-50 px-3 py-1 rounded-md flex items-center">
                    <span className="inline-block mr-1">•</span> Unsaved changes
                  </div>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-500 mb-4 text-lg">Your cart is empty</p>
                  <Link 
                    to="/" 
                    className="text-[#22874b] hover:text-[#135a6e] flex items-center justify-center text-lg"
                    aria-label="Continue shopping"
                  >
                    <ArrowLeftIcon className="h-6 w-6 mr-2" aria-hidden="true" />
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <AddtocartProduct
                        item={item}
                        quantity={cartQuantities[item._id]}
                        key={item._id}
                        onQuantityChange={handleQuantityChange}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>                  <div className="mt-6 flex justify-between items-center">
                    <Link 
                      to="/" 
                      className="text-[#22874b] hover:text-[#135a6e] flex items-center"
                      aria-label="Continue shopping"
                    >
                      <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                      Continue Shopping
                    </Link>
                    
                    {hasUnsavedChanges && (                      <button
                        onClick={() => {
                          try {
                            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartQuantities));
                            setHasUnsavedChanges(false);
                            toast.success("All cart changes saved");
                          } catch (error) {
                            console.error("Error saving cart:", error);
                            toast.error("Failed to save cart changes");
                          }
                        }}
                        className="bg-[#22874b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a6b3a] transition-colors relative group"
                        title="Press Ctrl+S to save changes"
                      >
                        Save All Changes
                        <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                          Shortcut: Ctrl+S
                        </span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-5">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className={`font-medium${discountAmount > 0 ? ' line-through text-gray-400' : ''}`}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ''}</span>
                      <span className="font-medium text-green-600">- {formatCurrency(discountAmount)}</span>
                    </div>
                  )}                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-semibold">Total</span>
                      <span className="font-bold text-lg text-[#22874b]">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
                    <Link
                      to='/checkout'
                      className="block md:w-[60%] bg-[#22874b] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium text-center"
                      onClick={handleProceedToCheckout}
                      aria-label="Proceed to checkout"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to empty your cart?")) {
                          clearCart();
                          setCartQuantities({});
                          setCartItems([]);
                          setAppliedCoupon(null);
                          setDiscountAmount(0);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-300 rounded-md py-2 px-3 hover:bg-red-50 transition-colors"
                    >
                      Empty Cart
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Have a Coupon?</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#22874b] focus:border-[#22874b] transition-colors"
                      aria-label="Coupon code"
                    />
                    <button
                      className="bg-[#22874b] hover:bg-[#1a6b3a] text-white px-4 py-2.5 rounded-r-md transition-colors flex items-center justify-center"
                      onClick={handleApplyCoupon}
                      type="button"
                      aria-label="Apply coupon"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {couponError && (
                    <div className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded-md">
                      {couponError}
                    </div>
                  )}
                  
                  {appliedCoupon && (
                    <div className="text-green-600 text-xs mt-2 bg-green-50 p-2 rounded-md">
                      <span className="font-medium">Success!</span> Coupon <b>{appliedCoupon.code}</b> applied.
                      <div className="mt-1">Discount: {formatCurrency(discountAmount)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Products */}
        {cartItems.length > 0 && recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(product => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative pb-[60%]">
                    <img 
                      src={product.image || 'https://via.placeholder.com/300x180'} 
                      alt={product.name}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.shortDescription}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#22874b]">{formatCurrency(product.price)}</span>
                      <Link 
                        to={`/product-details/${product._id}`}
                        className="text-[#22874b] hover:text-[#1a6b3a] text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
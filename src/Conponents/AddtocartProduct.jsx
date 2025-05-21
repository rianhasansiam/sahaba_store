import React, { useEffect, useState, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import ProductSizeTag from './ProductSizeTag';

const AddtocartProduct = ({ item, quantity, onQuantityChange, onDelete }) => {
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Available size options - memoized to avoid unnecessary re-renders
  const availableSizes = useMemo(() => ["250 ml", "500 ml", "1000 ml"], []);
  
  // Get the quantity and size from the cart data
  const [productQuantities, setProductQuantities] = useState(
    quantity?.quantity || 1
  );
  const [productSize, setProductSize] = useState(
    quantity?.size && availableSizes.includes(quantity.size) ? quantity.size : "250 ml"
  );
  
  // Calculate price based on size
  const getPriceBasedOnSize = (basePrice, size, qty) => {
    const price = parseFloat(basePrice);
    if (!price) return "0.00";
    
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
    
    return (price * multiplier * qty).toFixed(2);
  };
  // Update local state when quantity prop changes
  useEffect(() => {
    if (quantity) {
      if (typeof quantity === 'object') {
        setProductQuantities(quantity.quantity || 1);
        // Only set size if it's one of our valid options
        const size = quantity.size || "250 ml";
        if (availableSizes.includes(size)) {
          setProductSize(size);
        } else {
          setProductSize("250 ml"); // Default if invalid size
        }
      } else {
        // Handle the case where quantity is a number (old format)
        setProductQuantities(quantity || 1);
        setProductSize("250 ml"); // Default size for old format
      }
      setHasChanges(false); // Reset changes flag on prop update
    }
  }, [quantity, availableSizes]);
  // Save changes to parent component and localStorage
  const saveChanges = () => {
    if (!onQuantityChange || !item?._id) return;
    
    // Validate against available inventory
    if (item.availableAmount !== undefined && productQuantities > item.availableAmount) {
      toast.error(`Only ${item.availableAmount} items available in stock`);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update parent component state which will update localStorage
      onQuantityChange(item._id, { quantity: productQuantities, size: productSize });
      
      // Show success message
      toast.success("Cart updated successfully");
      setHasChanges(false);
      
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
      setIsSaving(false);
    }
  };  // Handle item removal with confirmation - local storage only
  const handleRemove = (id) => {
    setError(null);

    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to remove ${item.name} from your cart?`)) {
      try {
        // Only notify parent component - let the parent handle localStorage updates
        if (onDelete) {
          onDelete(id);
          toast.success("Item removed from cart");
        }
        
      } catch (error) {
        console.error("Error removing item from cart:", error);
        setError("Error removing item. Please try again.");
        toast.error("Failed to remove item");
      }
    }
  };

  const MAX_QUANTITY = 100;

  const incresingQuantity = () => {
    if (productQuantities >= MAX_QUANTITY) {
      toast.error(`Maximum quantity is ${MAX_QUANTITY}`);
      return;
    }
    
    // Check against available inventory
    if (item.availableAmount && productQuantities >= item.availableAmount) {
      toast.error(`Only ${item.availableAmount} items available in stock`);
      return;
    }
    
    setProductQuantities((prev) => prev + 1);
    setHasChanges(true);
  }
  
  const decreasingQuantity = () => {
    if (productQuantities <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    setProductQuantities((prev) => Math.max(1, prev - 1));
    setHasChanges(true);
  }
    // This function is handled directly in the onChange of the select element

  // Update cart with current values and validate inventory
  const updateCart = () => {
    if (!onQuantityChange || !item?._id) return;
    
    // Validate against available inventory
    if (item.availableAmount !== undefined && productQuantities > item.availableAmount) {
      toast.error(`Only ${item.availableAmount} items available in stock`);
      return;
    }
    
    setIsSaving(true);
    
    // Update parent component state which will update localStorage
    onQuantityChange(item._id, { quantity: productQuantities, size: productSize });
    
    toast.success("Cart updated");
    setHasChanges(false);
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
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
              {/* Size selector dropdown with price per unit */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-end gap-3">
              <div>
                <label htmlFor={`size-${item._id}`} className="text-gray-600 text-sm font-medium block mb-1">Size:</label>
                <div className="flex items-center">
                  <select 
                    id={`size-${item._id}`}
                    value={productSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      setProductSize(newSize);
                      setHasChanges(true);
                    }}
                    className="text-sm border border-gray-300 rounded-md py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-[#22874b] focus:border-[#22874b] transition-colors"
                  >
                    <option value="250 ml">250 ml</option>
                    <option value="500 ml">500 ml</option>
                    <option value="1000 ml">1000 ml</option>
                  </select>
                  <ProductSizeTag size={productSize} className="ml-2" />
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                <span className="block sm:inline font-medium">Unit Price: </span>
                <span className="font-semibold text-[#22874b]">{getPriceBasedOnSize(item.price, productSize, 1)} BDT</span>
              </div>
            </div>
              {item.availableAmount !== undefined && (
              <div className={`mt-2 text-sm p-1 px-2 inline-block rounded-md ${
                item.availableAmount <= 0 ? 'bg-red-50 text-red-600' : 
                item.availableAmount < 5 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {item.availableAmount <= 0 ? 'Out of stock' : 
                 item.availableAmount < 5 ? `Low stock: ${item.availableAmount} left` : 
                 `Available: ${item.availableAmount}`}
              </div>
            )}
          </div>          <button
            className="text-gray-400 hover:text-red-500"
            onClick={() => handleRemove(item._id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRemove(item._id);
              }
            }}
            aria-label={`Remove ${item.name} from cart`}
            tabIndex={0}
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
          <div className="flex items-center mb-4 sm:mb-0">            <button
              onClick={decreasingQuantity}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  decreasingQuantity();
                }
              }}
              className="border border-gray-300 rounded-l-md px-3 py-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
              tabIndex={0}
            >
              -
            </button>

            <span className={`border-t border-b border-gray-300 px-4 py-1.5 min-w-[40px] text-center font-medium ${
              item.availableAmount && productQuantities > item.availableAmount ? 'text-red-600' : 
              item.availableAmount && productQuantities === item.availableAmount ? 'text-orange-600' : ''
            }`}>
              {productQuantities}
            </span>            <button
              onClick={incresingQuantity}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!(item.availableAmount && productQuantities >= item.availableAmount)) {
                    incresingQuantity();
                  }
                }
              }}
              className={`border border-gray-300 rounded-r-md px-3 py-1.5 hover:bg-gray-100 transition-colors ${
                item.availableAmount && productQuantities >= item.availableAmount ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Increase quantity"
              disabled={item.availableAmount && productQuantities >= item.availableAmount}
              tabIndex={0}
            >
              +
            </button>{hasChanges && (
                <button
                  onClick={updateCart}
                  disabled={isSaving}
                  className="ml-3 bg-[#22874b] text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors hover:bg-[#1a6b3a]"
                  aria-label="Save changes"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Saved
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ShoppingCartIcon className="h-4 w-4 mr-1" />
                      Save
                    </span>
                  )}
                </button>
              )}
              {!hasChanges && !isSaving && (
                <span className="ml-3 text-xs text-green-600 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Up to date
                </span>
              )}
          </div>

          <div className="flex items-center">
            <span className="text-lg font-bold text-[#22874b]">
              {getPriceBasedOnSize(item.price, productSize, productQuantities)} BDT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddtocartProduct;

import { toast } from 'react-toastify';

// Utility functions for wishlist operations using localStorage

/**
 * Get wishlist items from localStorage
 * @returns {Array} Array of wishlist item IDs
 */
export const getWishlistItems = () => {
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Ensure we're returning an array of productIds
    if (!Array.isArray(wishlist)) {
      // If it's an object, convert to array of keys
      wishlist = Object.keys(wishlist);
    }
    
    return wishlist;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

/**
 * Add an item to the wishlist
 * @param {string} productId - The product ID to add
 * @returns {boolean} Success status
 */
export const addToWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    let wishlist = getWishlistItems();
    
    // Check if item already exists in wishlist
    if (wishlist.includes(productId)) {
      toast.info('Item already in wishlist');
      return false;
    }
    
    // Add item to wishlist
    wishlist.push(productId);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.success('Added to wishlist');
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
    return false;
  }
};

/**
 * Remove an item from the wishlist
 * @param {string} productId - The product ID to remove
 * @returns {boolean} Success status
 */
export const removeFromWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    let wishlist = getWishlistItems();
    
    // Filter out the item to remove
    wishlist = wishlist.filter(id => id !== productId);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist');
    return false;
  }
};

/**
 * Check if an item is in the wishlist
 * @param {string} productId - The product ID to check
 * @returns {boolean} True if item is in wishlist
 */
export const isInWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    const wishlist = getWishlistItems();
    return wishlist.includes(productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

/**
 * Move all wishlist items to cart
 * @returns {boolean} Success status
 */
export const moveWishlistToCart = () => {
  try {
    const wishlist = getWishlistItems();
    
    if (wishlist.length === 0) {
      toast.info('Wishlist is empty');
      return false;
    }
    
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('addtocart')) || {};
    
    // Add each wishlist item to cart
    wishlist.forEach(productId => {
      // Only add if not already in cart
      if (!cart[productId]) {
        cart[productId] = { quantity: 1, size: "250 ml" };
      }
    });
    
    // Save updated cart
    localStorage.setItem('addtocart', JSON.stringify(cart));
    toast.success('All items moved to cart');
    return true;
  } catch (error) {
    console.error('Error moving wishlist to cart:', error);
    toast.error('Failed to move items to cart');
    return false;
  }
};

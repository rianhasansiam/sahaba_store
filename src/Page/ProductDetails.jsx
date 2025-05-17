import { useParams } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { useState, useContext, useEffect } from 'react';
import { FaStar, FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import { contextData } from '../Contex';
import api from '../hooks/api';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, error } = useFetchData(
    'product',
    `/products/${id}`
  );
  const { userData } = useContext(contextData);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (product?._id) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
      setIsInWishlist(!!wishlist[product._id]);
    }
  }, [product]);

  const handleWishlistToggle = async () => {
    if (!userData) {
      toast.warn('Please login to manage your wishlist');
      return;
    }

    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
      const newWishlistState = !isInWishlist;

      if (newWishlistState) {
        // Add to wishlist
        await api.put('/add-to-wishlist', {
          email: userData.email,
          productId: product._id
        });
        wishlist[product._id] = true;
        toast.success('Added to wishlist');
      } else {
        // Remove from wishlist
        await api.put('/remove-from-wishlist', {
          email: userData.email,
          productId: product._id
        });
        delete wishlist[product._id];
        toast.success('Removed from wishlist');
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(newWishlistState);
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!userData) {
      toast.warn('Please login to add items to cart');
      return;
    }

    if (product.availableAmount <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await api.put('/add-to-cart', {
        email: userData.email,
        productId: product._id,
        quantity
      });

      // Update local cart storage
      const cart = JSON.parse(localStorage.getItem('addtocart')) || {};
      cart[product._id] = (cart[product._id] || 0) + quantity;
      localStorage.setItem('addtocart', JSON.stringify(cart));

      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading product...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading product</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleWishlistToggle}
              className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 ${
                isInWishlist 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FaHeart className={isInWishlist ? "text-red-500" : "text-gray-500"} /> 
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2">
              <FaShare /> Share
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            {/* <span className="text-gray-600">(24 reviews)</span> */}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">{product.price} BDT</span>
            {product.originalPrice && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                {product.originalPrice} BDT
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Short Description</h3>
            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Availability:</span>
              <span className={`font-semibold ${
                product.availableAmount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.availableAmount > 0 
                  ? `In Stock (${product.availableAmount} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex items-center mb-8">
           
            <button 
              onClick={handleAddToCart}
              className={`flex-1 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                product.availableAmount <= 0 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#167389] hover:bg-[#479aac]'
              }`}
              disabled={product.availableAmount <= 0 || isAddingToCart}
            >
              <FaShoppingCart /> 
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-2">Product ID</h3>
            <p className="text-gray-600">{product.productId}</p>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-[#167389] text-[#167389]">
              Description
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Reviews
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Shipping
            </button>
          </nav>
        </div>
        <div className="py-8">
          <h3 className="text-lg font-semibold mb-4">Full Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
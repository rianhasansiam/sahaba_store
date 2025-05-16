import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchData } from '../hooks/useFetchData'
import ProductCard from '../Conponents/ProductCard';

const AllProducts = () => {
  const { category } = useParams();

  // Fetch all products and categories
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useFetchData('products', '/products');
  const { data: categories, isLoading: catLoading } = useFetchData('categories', '/allcategories');

  // Filter products by category _id if not 'all'
  let products = Array.isArray(productsData) ? productsData : [];
  let currentCategory = category || 'all';
  if (currentCategory && currentCategory.toLowerCase() !== 'all') {
    products = products.filter(
      (product) => product.category === currentCategory
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {currentCategory === 'all'
            ? 'All Products'
            : `${(categories?.find(cat => cat._id === currentCategory)?.name || currentCategory)} Products`}
        </h1>
        <p className="text-lg text-gray-600">Browse our wide selection of quality items</p>
      </div>
      {/* Loading/Error States */}
      {(productsLoading || catLoading) && <div className="text-center py-8">Loading...</div>}
      {productsError && <div className="text-center text-red-500 py-8">Failed to load products.</div>}
      {/* Products Card Grid */}
      <ProductCard 
        products={products} 
        categoryName={currentCategory === 'all' 
          ? 'All Products' 
          : (categories?.find(cat => cat._id === currentCategory)?.name || currentCategory)
        } 
      />
    </div>
  )
}

export default AllProducts
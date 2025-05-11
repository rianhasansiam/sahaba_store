import React, { useEffect } from 'react';
import Banner from '../Conponents/Banner';
import ProductCard from '../Conponents/ProductCard';
import { useFetchData } from '../hooks/useFetchData';

const Home = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts
  } = useFetchData('products', '/products', {
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: categories,
    isLoading: categoryLoading,
    isError: categoryError,
    refetch: refetchCategories
  } = useFetchData('categories', '/allcategories', {
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    refetchProducts();
    refetchCategories();
  }, []);

  return (
    <div className='bg-[#f7f7f7]'>
      <Banner />

      {!productsLoading && !categoryLoading && categories?.map((cat) => {
        const productsForCategory = products?.filter(
          (product) => product.category === cat._id
        );

        return (
          <ProductCard
            key={cat._id}
            products={productsForCategory}
            categoryName={cat.name}
          />
        );
      })}
    </div>
  );
};

export default Home;

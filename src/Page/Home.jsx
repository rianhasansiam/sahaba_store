import React, { useEffect } from 'react';
import Banner from '../Conponents/Banner';
import ProductCard from '../Conponents/ProductCard';
import { useFetchData } from '../hooks/useFetchData';
import CategoryCard from '../Conponents/CategoryCard';

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
    <div className='bg-[#f7f7f7] '>
      <Banner />

<h1 className='text-center font-bold text-4xl mt-10 lg:text-6xl'>All Category</h1>
  <div className='flex gap-x-10 gap-y-4 my-10  container mx-auto flex-wrap justify-center'>
       {categories?.map((eachCategory) => (
  <CategoryCard  key={eachCategory._id} eachCategory={eachCategory} />
))}
  </div>



   <div className='mb-20'>


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


    </div>
  );
};

export default Home;

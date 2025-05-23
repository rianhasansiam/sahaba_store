import React, { useEffect } from 'react';

import { useFetchData } from '../hooks/useFetchData';
import HomepageCard from '../Conponents/HomepageCard';
import Banner from '../Conponents/Banner';


const Home = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts
  } = useFetchData('products', '/products', {
    staleTime: 10 * 60 * 1000,
  });

  // Uncomment if you need categories
  // const {
  //   data: categories,
  //   isLoading: categoryLoading,
  //   isError: categoryError,
  //   refetch: refetchCategories
  // } = useFetchData('categories', '/allcategories', {
  //   staleTime: 10 * 60 * 1000,
  // });

  useEffect(() => {
    refetchProducts();
    // Uncomment if you need categories
    // refetchCategories();
  }, [refetchProducts]); // Added dependency

  if (productsLoading) {
    return <div className="text-center py-20">Loading products...</div>;
  }

  if (productsError) {
    return <div className="text-center py-20 text-red-500">Error loading products</div>;
  }

  return (
    <div className='bg-[#f7f7f7]'>
 
     <Banner />
      {/* Uncomment if you need categories section */}
      {/* <h1 className='text-center font-bold text-4xl mt-10 lg:text-6xl'>All Category</h1>
      <div className='flex gap-x-10 gap-y-4 my-10 container mx-auto flex-wrap justify-center'>
        {categories?.map((eachCategory) => (
          <CategoryCard key={eachCategory._id} eachCategory={eachCategory} />
        ))}
      </div> */}


      <h1 className='text-center text-3xl font-bold lg:text-4xl my-10 lg:mt-14'>All Product</h1>

      <div className='mb-20 container mx-auto w-[98vw] lg:w-[90vw] '>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
          {products?.map((product) => (
            <HomepageCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useContext, useEffect, useState } from 'react';
import { HeartIcon, ShoppingCartIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { contextData } from '../Contex';
import { useFetchData } from '../hooks/useFetchData';
import WishlistCard from '../Conponents/WishlistCard';

const Wishlist = () => {

const {useData}=useContext(contextData)

//  const { data: wishlistItems, error, isLoading } = useFetchData(
//     "wishlistItems", // A unique key for this query
//     `/wishlist}` // API endpoint with the email query parameter
//   );

const [reload, setreload] = useState(false)

  const { 
    data: user, 
    isLoading, 
    isError, 
    error ,
    refetch
  } = useFetchData('posts', '/allusers', {
    staleTime: 10 * 60 * 1000,
  });



  // const handleDelete = async (userId) => {
  //   try {
  //     await axios.delete(`/deleteuser/${userId}`);
  //     queryClient.invalidateQueries(['posts']); // refetch after deletion
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //   }
  // };


  useEffect(() => {
 
refetch()

}, [reload]);
  











  // console.log(user)
  // const wishlistItems = [
  //   {
  //     id: 1,
  //     name: "Store Heavyweight Hoodies",
  //     variant: "Mr. Black",
  //     price: 50,
  //     rating: 4.2,
  //     reviewCount: 12,
  //     image: "https://via.placeholder.com/150"
  //   },
  //   {
  //     id: 2,
  //     name: "Alarm Golly",
  //     variant: "Blue",
  //     price: 50,
  //     rating: 4.2,
  //     reviewCount: 12,
  //     image: "https://via.placeholder.com/150"
  //   },
  //   {
  //     id: 3,
  //     name: "Auto Body",
  //     variant: "White",
  //     price: 50,
  //     rating: 4.2,
  //     reviewCount: 12,
  //     image: "https://via.placeholder.com/150"
  //   },
  //   {
  //     id: 4,
  //     name: "Lancelto",
  //     variant: "Black",
  //     price: 50,
  //     rating: 4.2,
  //     reviewCount: 12,
  //     image: "https://via.placeholder.com/150"
  //   }
  // ];

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
                {/* <h2 className="text-xl font-semibold">Your Wishlist ({wishlistItems.length})</h2> */}
                <button className="text-[#167389] hover:text-[#135a6e] flex items-center">
                  Move all to cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
                </button>
              </div>

            

{user?.map((eachuser) =>  (eachuser?.addToWishlist?<WishlistCard key={eachuser?._id}  eachuser={eachuser}  setreload={setreload} reload={reload}></WishlistCard>:'') )}




 

            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (2 items)</span>
                  <span className="font-medium">$100</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg">$100</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Taxes and shipping calculated at checkout
                </div>
                
                <button className="w-full bg-[#167389] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium flex items-center justify-center">
                  Continue to Checkout <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
                
                <div className="flex justify-center mt-4">
                  <a href="#" className="text-[#167389] hover:text-[#135a6e] flex items-center">
                    Continue Shopping <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </a>
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
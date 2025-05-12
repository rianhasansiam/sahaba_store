import React, { useEffect, useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import WishlishtEachcard from './WishlishtEachcard';


const Wishlist = ({ eachuser, setreload,reload }) => {

  
   
//   const [products, setProducts] = useState([]);




  const productId = eachuser.addToWishlist














  return (
    <div>
      {productId?.map((id, index) => (


        <WishlishtEachcard key={index} id={id} setreload={setreload} reload={reload}></WishlishtEachcard>


      ))}
    </div>
  );
};

export default Wishlist;

import React from 'react';
import WishlishtEachcard from './WishlishtEachcard';

const Wishlist = ({ eachuser, setReload, reload }) => {
  const productId = eachuser.addToWishlist;
  return (
    <div>
      {productId?.map((id, index) => (
        <WishlishtEachcard key={index} id={id} setreload={setReload} reload={reload}></WishlishtEachcard>
      ))}
    </div>
  );
};

export default Wishlist;

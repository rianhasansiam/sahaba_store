import React from 'react';
import WishlishtEachcard from './WishlishtEachcard';

const WishlistCard = ({ products, items, setReload, reload }) => {
  return (
    <div className="divide-y divide-gray-200">
      {products.map((product, index) => (
        <WishlishtEachcard 
          key={index}
          product={product}
          id={items[index]} 
          setreload={setReload} 
          reload={reload}
        />
      ))}
    </div>
  );
};

export default WishlistCard;

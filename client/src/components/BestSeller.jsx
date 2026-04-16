import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  // Filter best sellers
  const bestSellers = products
    ?.filter((product) => product.inStock)
    .slice(0, 5);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>

      {(!bestSellers || bestSellers.length === 0) ? (
        <p className="mt-4 text-gray-500">No best sellers available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 mt-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;

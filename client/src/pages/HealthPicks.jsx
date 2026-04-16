import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';

const HealthPicks = () => {
  const navigate = useNavigate();
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const healthCategories = [
    {
      id: 1,
      title: 'Healthy Food',
      image: assets.dryfruits,
      description: 'Nutritious and balanced meals for your daily wellness journey.',
      category: 'healthy-food',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      title: 'High Protein',
      image: assets.highprotein,
      description: 'Quality protein sources for muscle health and recovery.',
      category: 'high-protein',
      bgColor: 'bg-orange-50'
    },
    {
      id: 3,
      title: 'Weight Loss',
      image: assets.weightloss,
      description: 'Smart food choices to support your weight management goals.',
      category: 'weight-loss',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      title: 'Immunity Boost',
      image: assets.immunity,
      description: 'Natural immunity boosters for your overall health.',
      category: 'immunity',
      bgColor: 'bg-cyan-50'
    }
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : [];

  // Get the background color for the selected category
  const selectedBgColor = selectedCategory
    ? healthCategories.find(cat => cat.category === selectedCategory)?.bgColor
    : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${selectedBgColor}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Health Picks</h1>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.category)}
            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${
              selectedCategory === category.category ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
              <div className="mt-4 flex items-center text-primary font-medium text-sm">
                View Products
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {selectedCategory && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {healthCategories.find(cat => cat.category === selectedCategory)?.title} Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products found in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Health Picks?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium mb-2">Curated Selection</h3>
            <p className="text-gray-600 text-sm">Carefully selected products that meet our health standards.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium mb-2">Quality Assured</h3>
            <p className="text-gray-600 text-sm">All products are verified for quality and nutritional value.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium mb-2">Expert Guidance</h3>
            <p className="text-gray-600 text-sm">Detailed product information to make informed choices.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPicks;
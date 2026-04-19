import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';

const HealthPicks = () => {
  const { products, t, getCategoryLabel } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const healthCategories = [
    {
      id: 1,
      title: getCategoryLabel('healthy-food'),
      image: assets.dryfruits,
      description: t("health.desc1"),
      category: 'healthy-food',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      title: getCategoryLabel('high-protein'),
      image: assets.highprotein,
      description: t("health.desc2"),
      category: 'high-protein',
      bgColor: 'bg-orange-50'
    },
    {
      id: 3,
      title: getCategoryLabel('weight-loss'),
      image: assets.weightloss,
      description: t("health.desc3"),
      category: 'weight-loss',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      title: getCategoryLabel('immunity'),
      image: assets.immunity,
      description: t("health.desc4"),
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
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{t("health.title")}</h1>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {healthCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.category)}
            className={`bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group text-left ${
              selectedCategory === category.category ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2 leading-tight">
                {category.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                {category.description}
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-primary font-medium text-xs sm:text-sm">
                {t("health.viewProducts")}
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
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            {t("health.products", { title: healthCategories.find(cat => cat.category === selectedCategory)?.title || "" })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">{t("health.empty")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">{t("health.why")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium text-sm sm:text-base mb-1.5 sm:mb-2">{t("health.curated")}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t("health.curatedDesc")}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium text-sm sm:text-base mb-1.5 sm:mb-2">{t("health.quality")}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t("health.qualityDesc")}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <div className="text-primary text-xl mb-3">✓</div>
            <h3 className="font-medium text-sm sm:text-base mb-1.5 sm:mb-2">{t("health.guidance")}</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{t("health.guidanceDesc")}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPicks;
import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems, navigate, t, getCategoryLabel} = useAppContext();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAddToCart = (e, productId) => {
        e.stopPropagation();
        if (isAnimating) return;
        
        setIsAnimating(true);
        const productImage = e.currentTarget.closest('.product-card').querySelector('.product-image');
        const cartIcon = document.querySelector('.nav-cart-icon');
        
        if (productImage && cartIcon) {
            const productRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            const flyingImage = productImage.cloneNode(true);
            Object.assign(flyingImage.style, {
                position: 'fixed',
                top: `${productRect.top}px`,
                left: `${productRect.left}px`,
                width: `${productRect.width}px`,
                height: `${productRect.height}px`,
                transition: 'all 0.5s ease-in-out',
                zIndex: '9999',
                pointerEvents: 'none'
            });
            
            document.body.appendChild(flyingImage);
            
            requestAnimationFrame(() => {
                Object.assign(flyingImage.style, {
                    top: `${cartRect.top}px`,
                    left: `${cartRect.left}px`,
                    width: '20px',
                    height: '20px',
                    opacity: '0',
                    transform: 'scale(0.2)'
                });
            });
            
            setTimeout(() => {
                flyingImage.remove();
                addToCart(productId);
                setIsAnimating(false);
            }, 500);
        } else {
            // If elements not found, just add to cart
            addToCart(productId);
            setIsAnimating(false);
        }
    };

    return product && (
        <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="product-card border border-gray-300 rounded-lg md:px-4 px-3 py-3 bg-white hover:shadow-lg transition h-full flex flex-col">
            <div className="group cursor-pointer flex items-center justify-center px-2 mb-2">
                <img className="product-image group-hover:scale-110 transition w-full aspect-square object-cover rounded" src={product.image[0]} alt={product.name} />
            </div>
            <div className="flex-1 flex flex-col text-gray-600 text-xs md:text-sm">
                <p className="text-gray-500 text-xs">{getCategoryLabel(product.category)}</p>
                <p className="text-gray-900 font-semibold text-sm md:text-base line-clamp-2 min-h-10">{product.name}</p>
                <div className="flex items-center gap-1 my-1">
                          {new Array(5).fill('').map((_, i) => (
                           <img key={i} className="w-3 md:w-4" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
                    ))}
                    <p className="text-xs text-gray-500">(4)</p>
                </div>
                <div className="flex items-center justify-between gap-1 mt-auto pt-2">
                    <div>
                        <p className="text-sm md:text-base font-bold text-primary">
                            {currency}{product.offerPrice}
                        </p>
                        <p className="text-xs text-gray-400 line-through">{currency}{product.price}</p>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {cartItems[product._id] ? (
                            <div className="flex items-center justify-center gap-2 bg-primary/10 border border-primary rounded select-none px-2 py-1.5 shadow-sm">
                                <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-base text-primary px-1.5 h-full hover:bg-primary/20 rounded transition" >
                                    −
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-primary">{cartItems[product._id]}</span>
                                <button onClick={() => {addToCart(product._id)}} className="cursor-pointer text-base text-primary px-1.5 h-full hover:bg-primary/20 rounded transition" >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 px-2 md:px-3 py-2 rounded hover:bg-primary/20 transition text-xs md:text-sm whitespace-nowrap" 
                                onClick={(e) => handleAddToCart(e, product._id)}
                                disabled={isAnimating}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4"/>
                                <span>{t("product.add")}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
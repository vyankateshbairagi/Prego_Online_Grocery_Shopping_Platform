import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const CartWidget = () => {
  const { cartItems, getCartAmount, getCartCount, currency, products, addToCart, removeFromCart, setCartItems, FREE_DELIVERY_THRESHOLD, hasFreeDelivery, user, setShowUserLogin, getSubtotal, getDeliveryFee, t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const itemCount = getCartCount();
  const subtotal = getSubtotal();
  const total = getCartAmount();
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPercentage = (subtotal / FREE_DELIVERY_THRESHOLD) * 100;

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hide widget if cart is empty or if we're on the cart or add-address page
  if (itemCount === 0 || location.pathname === '/cart' || location.pathname === '/add-address') return null;

  return (
    <>
      {/* Main Cart Widget */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-2xl mx-auto">
        <div
          onClick={() => setIsOpen(true)}
          className="bg-white rounded-full shadow-lg border border-gray-100 px-4 py-3 cursor-pointer"
        >
          {/* Free Delivery Progress */}
          <div className="mb-2 px-2">
            {amountForFreeDelivery > 0 ? (
              <div className="text-xs text-gray-600 text-center">
                {t("widget.addMore", { currency, amount: amountForFreeDelivery })}
              </div>
            ) : (
              <div className="text-xs text-primary text-center font-medium">
                {t("widget.freeDeliveryYay")}
              </div>
            )}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Cart Summary */}
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 nav-cart-icon" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">
                  {currency}{getSubtotal()} + {hasFreeDelivery() ? t("widget.freeDelivery") : `${currency}${getDeliveryFee()} ${t("widget.delivery")}`}
                </div>
                <span className="font-semibold text-gray-800">
                  = {currency}{total}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-1 justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition whitespace-nowrap"
              >
                {t("widget.viewCart")}
              </button>
              {user ? (
                <Link
                  to="/cart"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-primary text-white px-3 md:px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition whitespace-nowrap"
                >
                  {t("widget.checkout")}
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserLogin(true);
                    setIsOpen(false); // Close mini cart if open
                    setCartItems({}); // Clear cart items to hide floating cart
                  }}
                  className="bg-primary text-white px-3 md:px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition whitespace-nowrap"
                >
                  {t("nav.login")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Cart Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{t("widget.yourCart", { count: itemCount })}</h2>
                  <button onClick={() => setIsOpen(false)} className="p-2">
                    ✕
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {Object.entries(cartItems).map(([productId, quantity]) => {
                    const product = products.find(p => p._id === productId);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={productId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group"
                      >
                        <img src={product.image[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="text-sm text-gray-600">
                            {quantity} × {currency}{product.offerPrice} = {currency}{(quantity * product.offerPrice).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => addToCart(productId)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const updatedCart = { ...cartItems };
                            delete updatedCart[productId];
                            setCartItems(updatedCart);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition p-2 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 space-y-4">
                  {amountForFreeDelivery > 0 && (
                    <div className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
                      {t("widget.addItemsMore", { currency, amount: amountForFreeDelivery })}
                    </div>
                  )}
                  {user ? (
                    <Link
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-dark transition"
                    >
                      {t("widget.proceedCheckout", { currency, total })}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowUserLogin(true);
                        setCartItems({}); // Clear cart items to hide floating cart
                      }}
                      className="block w-full text-center bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-dark transition"
                    >
                      {t("widget.proceedLogin", { currency, total })}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartWidget;

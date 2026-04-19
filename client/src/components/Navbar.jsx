import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const location = useLocation();

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    language,
    changeLanguage,
    t,
  } = useAppContext();

  const quickCategories = [
    { key: "nav.organicVeggies", path: "/products/vegetables" },
    { key: "nav.freshFruits", path: "/products/fruits" },
    { key: "nav.coldDrinks", path: "/products/drinks" },
    { key: "nav.instantFood", path: "/products/instant" },
    { key: "nav.dairyProducts", path: "/products/dairy" },
    { key: "nav.bakeryBreads", path: "/products/bakery" },
    { key: "nav.grains", path: "/products/grains" },
    { key: "nav.snacks", path: "/products/snacks" },
    { key: "nav.chocolates", path: "/products/chocolates" },
    { key: "nav.spices", path: "/products/spices" },
    { key: "nav.biscuitsCookies", path: "/products/Biscuits" },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!languageMenuRef.current?.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 md:px-20 lg:px-32 xl:px-40 py-4 navbar-bg shadow-sm border-b border-gray-100">
        <NavLink to='/' onClick={() => setOpen(false)}>
          <img className="h-9" src={assets.logo} alt="logo" />
        </NavLink>
        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          {location.pathname !== "/" && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
                }`
              }
            >
              {t("nav.home")}
            </NavLink>
          )}

          <NavLink
            to="/health-picks"
            className={({ isActive }) =>
              `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
              }`
            }
          >
            {t("nav.healthPicks")}
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
              }`
            }
          >
            {t("nav.allProducts")}
          </NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center text-base gap-2 border border-gray-300 px-3 py-2 rounded-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition bg-gray-50">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800 text-sm"
              type="text"
              placeholder={t("nav.searchProducts")}
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-60" />
          </div>

          {/* Language Switcher (Right of Search) */}
          <div ref={languageMenuRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 bg-white hover:border-primary transition"
              aria-label="language switcher"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15 15 0 0 1 0 20" />
                <path d="M12 2a15 15 0 0 0 0 20" />
              </svg>
              <span className="text-xs font-semibold text-gray-700 uppercase">{language}</span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {[
                  { code: "en", label: t("lang.english") },
                  { code: "hi", label: t("lang.hindi") },
                  { code: "mr", label: t("lang.marathi") },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition ${language === lang.code ? "text-primary font-medium" : "text-gray-700"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80 nav-cart-icon" />
            {getCartCount() > 0 && (
              <div className="absolute -top-3 -right-2 bg-primary text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {getCartCount()}
              </div>
            )}
          </div>

          {/* User Login / Profile */}
          {user ? (
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10" alt="" />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("my-orders")}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  {t("nav.myOrders")}
                </li>
                <li
                  onClick={logout}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  {t("nav.logout")}
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              {t("nav.login")}
            </button>
          )}
        </div>

        {/* Mobile Menu + Cart */}
        <div className="flex items-center gap-6 sm:hidden">
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
            {getCartCount() > 0 && (
              <div className="absolute -top-3 -right-2 bg-primary text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {getCartCount()}
              </div>
            )}
          </div>

          <button onClick={() => setOpen(!open)} aria-label={t("nav.menu")}>
            <img src={assets.menu_icon} alt="menu" />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="absolute top-[60px] left-0 w-full navbar-bg shadow-md py-4 flex flex-col items-start gap-2 px-5 text-base md:hidden">
            {location.pathname !== "/" && (
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
                  }`
                }
              >
                {t("nav.home")}
              </NavLink>
            )}

            <NavLink
              to="/health-picks"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
                }`
              }
            >
              {t("nav.healthPicks")}
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
                }`
              }
            >
              {t("nav.allProducts")}
            </NavLink>

            <div className="w-full mt-1">
              <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-2 text-sm bg-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15 15 0 0 1 0 20" />
                  <path d="M12 2a15 15 0 0 0 0 20" />
                </svg>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="en">{t("lang.english")}</option>
                  <option value="hi">{t("lang.hindi")}</option>
                  <option value="mr">{t("lang.marathi")}</option>
                </select>
              </div>
            </div>

            {user && (
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className="transition px-2 py-1 rounded text-gray-800 hover:text-primary"
              >
                {t("nav.myOrders")}
              </NavLink>
            )}

            {user ? (
              <button
                onClick={logout}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                {t("nav.login")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-6 pb-3 pt-1 navbar-bg border-b border-gray-100">
        <div className="flex items-center text-base gap-2 border border-gray-300 px-3 py-2 rounded-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition bg-gray-50">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800 text-sm"
            type="text"
            placeholder={t("nav.searchProducts")}
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-60" />
        </div>
      </div>

      {/* Bottom Navbar (Categories) - Hidden for health-picks */}
      {location.pathname !== '/health-picks' && (
        <nav className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-3 flex items-center gap-6 text-sm font-medium border-b border-gray-200 overflow-x-auto no-scrollbar">
          {quickCategories.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `whitespace-nowrap transition ${isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;

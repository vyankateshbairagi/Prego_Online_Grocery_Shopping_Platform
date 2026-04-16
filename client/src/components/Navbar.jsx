import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
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
  } = useAppContext();

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
              Home
            </NavLink>
          )}

          <NavLink
            to="/health-picks"
            className={({ isActive }) =>
              `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
              }`
            }
          >
            Health Picks
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
              }`
            }
          >
            All Products
          </NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center text-base gap-2 border border-gray-300 px-3 py-2 rounded-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition bg-gray-50">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800 text-sm"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-60" />
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
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10" alt="" />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("my-orders")}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
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

          <button onClick={() => setOpen(!open)} aria-label="Menu">
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
                Home
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
              Health Picks
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `transition px-2 py-1 rounded text-lg ${isActive ? "text-primary font-semibold" : "text-gray-800 hover:text-primary"
                }`
              }
            >
              All Products
            </NavLink>

            {user && (
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className="transition px-2 py-1 rounded text-gray-800 hover:text-primary"
              >
                My Orders
              </NavLink>
            )}

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navbar (Categories) - Hidden for health-picks */}
      {location.pathname !== '/health-picks' && (
        <nav className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-3 flex items-center gap-6 text-sm font-medium border-b border-gray-200 overflow-x-auto">
          {[
            { name: "Organic Veggies", path: "/products/vegetables" },
            { name: "Fresh Fruits", path: "/products/fruits" },
            { name: "Cold Drinks", path: "/products/drinks" },
            { name: "Instant Food", path: "/products/instant" },
            { name: "Dairy Products", path: "/products/dairy" },
            { name: "Bakery & Breads", path: "/products/bakery" },
            { name: "Grains", path: "/products/grains" },
            { name: "Snacks", path: "/products/snacks" },
            { name: "Tea & Coffee", path: "/products/tea" },
            { name: "Chocolates", path: "/products/chocolates" },
            { name: "Spices", path: "/products/spices" },
            { name: "Biscuits & Cookies", path: "/products/Biscuits" }

          ].map((item) => (
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
              {item.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;

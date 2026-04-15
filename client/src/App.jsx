import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import HealthPicks from './pages/HealthPicks';

import Slider from './components/Slider.jsx';
import Footer from './components/Footer';
import { useAppContext } from './context/Appcontext.jsx';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import CartWidget from './components/CartWidget';

const App = () => {
  const location = useLocation();   // 👈 use location
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {/* Navbar only for non-seller paths */}
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      {/* ✅ Slider only on Home */}
      {location.pathname === "/" && <Slider />}

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/health-picks' element={<HealthPicks />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />

          {/* Seller routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>

      {/* Footer only for non-seller paths */}
      {!isSellerPath && <Footer />}

      {/* Cart Widget */}
      {!isSellerPath && <CartWidget />}
    </div>
  );
};

export default App;

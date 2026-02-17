import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/Cartcontext';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider } from './context/UIContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import FilterSidebar from './components/FilterSidebar';
import QuickView from './components/QuickView';

import Home from './pages/HomePage';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminPage from './pages/Admin ';

import './assets/css/styles.css';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <UIProvider>
          <Router>
            <Navbar />
            <CartSidebar />
            <WishlistSidebar />
            <FilterSidebar />
            <QuickView />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product-details" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
               <Route path="/admin" element={<AdminPage />} />
            </Routes>

            <Footer />
          </Router>
        </UIProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
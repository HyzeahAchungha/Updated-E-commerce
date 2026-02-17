import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};

export const UIProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openWishlist = () => setWishlistOpen(true);
  const closeWishlist = () => setWishlistOpen(false);
  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);
  const openQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  return (
    <UIContext.Provider value={{
      cartOpen, openCart, closeCart,
      wishlistOpen, openWishlist, closeWishlist,
      filterOpen, openFilter, closeFilter,
      quickViewProduct, openQuickView, closeQuickView,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
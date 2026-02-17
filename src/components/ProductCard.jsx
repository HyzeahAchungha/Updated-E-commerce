import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';

const ProductCard = ({ image, name, price, id }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openCart, openFilter, openQuickView } = useUI();

  const product = { id, image, name, price };
  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    openCart();
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    openQuickView(product);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    openFilter();
  };

  return (
    <div className="product">
      <div className="img-container">
        <img src={image} alt={name} />
        <div className="addCart" onClick={handleAddToCart} style={{ cursor: 'pointer' }}>
          <i className="fa fa-shopping-cart"></i>
        </div>
        <ul className="side-icons">
          <span onClick={handleQuickView} title="Quick View" style={{ cursor: 'pointer' }}>
            <i className="fa fa-search"></i>
          </span>
          <span
            onClick={handleWishlist}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            style={{ cursor: 'pointer', background: inWishlist ? '#ff4444' : '', color: inWishlist ? 'white' : '' }}
          >
            <i className="fa fa-heart"></i>
          </span>
          <span onClick={handleFilter} title="Filter" style={{ cursor: 'pointer' }}>
            <i className="fa fa-sliders"></i>
          </span>
        </ul>
      </div>
      <div className="bottom">
        <Link to="/product-details">{name}</Link>
        <div className="price">
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
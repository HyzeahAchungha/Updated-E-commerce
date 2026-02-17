import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { useCart } from '../context/Cartcontext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';
import product1 from "../assets/images/product-1.jpg";
import product2 from "../assets/images/product-2.jpg";
import product3 from "../assets/images/product-3.jpg";
import product4 from "../assets/images/product-4.jpg";
import product5 from "../assets/images/product-5.jpg";
import product6 from "../assets/images/product-6.jpg";

const FeaturedProducts = () => {
  const swiperRef = useRef(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openCart, openFilter, openQuickView } = useUI();

  const featuredProducts = [
    { id: 101, image: product1, name: 'Achungha mini fruit', price: '$150' },
    { id: 102, image: product2, name: 'Achungha mini fruit', price: '$150' },
    { id: 103, image: product3, name: 'Achungha mini fruit', price: '$150' },
    { id: 104, image: product4, name: 'Achungha mini fruit', price: '$150' },
    { id: 105, image: product5, name: 'Achungha mini fruit', price: '$150' },
    { id: 106, image: product6, name: 'Achungha mini fruit', price: '$150' },
  ];

  const handleAddToCart = (product) => { addToCart(product); openCart(); };
  const handleWishlist = (product) => { toggleWishlist(product); };
  const handleQuickView = (product) => { openQuickView(product); };

  useEffect(() => {
    swiperRef.current = new Swiper(".slider-2", {
      grabCursor: true,
      spaceBetween: 30,
      navigation: {
        nextEl: ".custom-next",
        prevEl: ".custom-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      },
    });

    return () => {
      if (swiperRef.current && swiperRef.current.destroy) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  return (
    <section className="section featured">
      <div className="title">
        <h2>Achungha Feature Products</h2>
        <span> Fresh groceries and very affordable.</span>
      </div>
      <div className="row container">
        <div className="swiper-container slider-2">
          <div className="swiper-wrapper">
            {featuredProducts.map(product => (
              <div key={product.id} className="swiper-slide">
                <div className="product">
                  <div className="img-container">
                    <img src={product.image} alt="" />
                    <div 
                      className="addCart" 
                      onClick={() => handleAddToCart(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fa fa-shopping-cart"></i>
                    </div>
                    <ul className="side-icons">
                      <span onClick={() => handleQuickView(product)} style={{ cursor: 'pointer' }} title="Quick View">
                        <i className="fa fa-search"></i>
                      </span>
                      <span
                        onClick={() => handleWishlist(product)}
                        style={{ cursor: 'pointer', background: isInWishlist(product.id) ? '#ff4444' : '', color: isInWishlist(product.id) ? 'white' : '' }}
                        title="Wishlist"
                      >
                        <i className="fa fa-heart"></i>
                      </span>
                      <span onClick={() => openFilter()} style={{ cursor: 'pointer' }} title="Filter">
                        <i className="fa fa-sliders"></i>
                      </span>
                    </ul>
                  </div>
                  <div className="bottom">
                    <Link to="/product-details">{product.name}</Link>
                    <div className="price">
                      <span>{product.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="arrows d-flex">
        <div className="swiper-prev d-flex">
          <i className="fa fa-chevron-left"></i>
        </div>
        <div className="swiper-next d-flex swiper-icon">
          <i className="fa fa-chevron-right swiper-icon"></i>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
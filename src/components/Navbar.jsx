import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';
import logo from "../assets/images/logo.png"
import navimg from "../assets/images/nav.png"
import bag from "../assets/images/shoppingBag.svg"
import search from '../assets/images/search.svg'

const Navbar = () => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { openCart, openWishlist } = useUI();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const products = [
    { id: 1, name: 'Fresh Orange Juice', price: 150, image: './images/product-10.jpg', category: 'Juice' },
    { id: 2, name: 'Mango Delight', price: 200, image: './images/product-8.jpg', category: 'Mango' },
    { id: 3, name: 'Grape Bundle', price: 180, image: './images/product-14.jpg', category: 'Grapes' },
    { id: 4, name: 'Potato Pack', price: 120, image: './images/product-13.jpg', category: 'Potato' },
    { id: 5, name: 'Orange Fresh', price: 160, image: './images/product-11.jpg', category: 'Orange' },
    { id: 6, name: 'Pineapple Special', price: 220, image: './images/product-12.jpg', category: 'Pineapple' },
  ];

  const searchedProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const openNav = document.querySelector(".open-btn");
    const closeNav = document.querySelector(".close-btn");
    const menu = document.querySelector(".nav-list");

    const openMenu = () => {
      menu.classList.add("show");
    };

    const closeMenu = () => {
      menu.classList.remove("show");
    };

    openNav.addEventListener("click", openMenu);
    closeNav.addEventListener("click", closeMenu);
    const navBar = document.querySelector(".nav");
    const navHeight = navBar.getBoundingClientRect().height;
    
    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      if (scrollHeight > navHeight) {
        navBar.classList.add('fix-nav');
      } else {
        navBar.classList.remove('fix-nav');
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest('.search-dropdown') && !event.target.closest('.icons')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      openNav.removeEventListener("click", openMenu);
      closeNav.removeEventListener("click", closeMenu);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <nav className="nav">
      <div className="wrapper container">
        <div className="logo">
          <Link to="/">
            <h2 style={{ marginTop: '5%' }}></h2>
            <img src={logo} alt="" />
          </Link>
        </div>
        <ul className="nav-list">
          <div className="top">
            <label htmlFor="" className="btn close-btn">
              <i className="fa fa-times"></i>
            </label>
          </div>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li>
            <a href="" className="desktop-item">Shop <span><i className="fa fa-chevron-down"></i></span></a>
            <input type="checkbox" id="showMega" />
            <label htmlFor="showMega" className="mobile-item">Shop <span><i className="fa fa-chevron-down"></i></span></label>
            <div className="mega-box">
              <div className="content">
                <div className="row">
                  <img src={navimg} alt="" />
                </div>
                <div className="row">
                  <header>Shop Layout</header>
                  <ul className="mega-links">
                    <li><a href="#">Shop With Achungha</a></li>
                    <li><a href="#">Shop Mini Categories</a></li>
                    <li><a href="#">Shop Only Categories</a></li>
                    <li><a href="#">Shop Icon Categories</a></li>
                  </ul>
                </div>
                <div className="row">
                  <header>Filter Layout</header>
                  <ul className="mega-links">
                    <li><a href="#">Sidebar</a></li>
                    <li><a href="#">Filter Default</a></li>
                    <li><a href="#">Filter Drawer</a></li>
                    <li><a href="#">Filter Dropdown</a></li>
                  </ul>
                </div>
                <div className="row">
                  <header>Product Layout</header>
                  <ul className="mega-links">
                    <li><a href="#">Layout Zoom</a></li>
                    <li><a href="#">Layout Sticky</a></li>
                    <li><a href="#">Layout Sticky 2</a></li>
                    <li><a href="#">Layout Scroll</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li><a href="">About</a></li>
          <li><a href="">Contact</a></li>
              <li><a href="">Faq</a></li>

          <li className="icons">
            <span onClick={() => setSearchOpen(!searchOpen)} style={{ cursor: 'pointer' }}>
              <img src={search} alt="Search" />
            </span>
            
            <span onClick={openWishlist} style={{ position: 'relative', cursor: 'pointer' }}>
              <i className="fa fa-heart" style={{ fontSize: '22px', color: '#222' }}></i>
              {getWishlistCount() > 0 && (
                <small className="count d-flex" style={{ 
                  position: 'absolute', 
                  top: '5px', 
                  right: '-8px',
                  background: '#69ae14',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  {getWishlistCount()}
                </small>
              )}
            </span>

            <span onClick={openCart} style={{ position: 'relative', cursor: 'pointer' }}>
              <img src={bag} alt="Cart" />
              {getCartCount() > 0 && (
                <small className="count d-flex" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#69ae14',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  {getCartCount()}
                </small>
              )}
            </span>
          </li>
        </ul>
        <label htmlFor="" className="btn open-btn">
          <i className="fa fa-bars"></i>
        </label>
      </div>

      {searchOpen && (
        <div className="search-dropdown" style={{
          position: 'absolute',
          top: '8rem',
          right: '2rem',
          width: '400px',
          maxHeight: '500px',
          background: 'white',
          boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
          borderRadius: '10px',
          padding: '20px',
          overflowY: 'auto',
          zIndex: 1001
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '15px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#69ae14'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {searchQuery && searchedProducts.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999' }}>No products found</p>
            )}
            {searchQuery && searchedProducts.map(product => (
              <Link 
                key={product.id} 
                to="/product-details"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  marginBottom: '10px',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#e0e0e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#666',
                  overflow: 'hidden'
                }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '5px' }}>{product.name}</h4>
                  <div style={{ color: '#69ae14', fontWeight: '600' }}>${product.price}</div>
                </div>
              </Link>
            ))}
          </div>
          
          <button 
            onClick={() => setSearchOpen(false)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '15px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
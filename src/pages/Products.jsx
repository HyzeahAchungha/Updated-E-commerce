import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';

import product1 from "../assets/images/product-1.jpg";
import product2 from "../assets/images/product-2.jpg";
import product3 from "../assets/images/product-3.jpg";
import product4 from "../assets/images/product-4.jpg";
import product5 from "../assets/images/product-5.jpg";
import product6 from "../assets/images/product-6.jpg";
import product7 from "../assets/images/product-7.jpg";
import product8 from "../assets/images/product-8.jpg";
import product9 from "../assets/images/product-9.jpg";
import product10 from "../assets/images/product-10.jpg";
import product11 from "../assets/images/product-11.jpg";
import product12 from "../assets/images/product-12.jpg";
import product13 from "../assets/images/product-13.jpg";
import product14 from "../assets/images/product-14.jpg";



const fallbackImages = [
  product1, product2, product3, product4, product5, product6, product7,
  product8, product9, product10, product11, product12, product13, product14,
];

// Default demo products (shown if admin hasn't added any yet)
const defaultProducts = Array(12).fill(null).map((_, i) => ({
  id: i + 200,
  image: fallbackImages[i % fallbackImages.length],
  name: 'Achungha Mini Backpack',
  category: ['Fruits', 'Fruits','Veges','Veges',][i % 4],
  price: '$150',
}));

const CATEGORIES = ['All',  'Fruits', 'Fruits','Veges', 'Veges',];

const Products = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openCart, openFilter, openQuickView } = useUI();

  // Load products: admin-added products first, then fill with defaults if none
  const [adminProducts, setAdminProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('achungha_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAdminProducts(parsed.length > 0 ? parsed : defaultProducts);
    } else {
      setAdminProducts(defaultProducts);
    }
  }, []);

  // Filtering + sorting
  const filteredProducts = adminProducts
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const pa = parseFloat(String(a.price).replace('$', ''));
      const pb = parseFloat(String(b.price).replace('$', ''));
      if (sortBy === 'price-asc')  return pa - pb;
      if (sortBy === 'price-desc') return pb - pa;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAddToCart  = (p) => { addToCart(p); openCart(); };
  const handleWishlist   = (p) => { toggleWishlist(p); };
  const handleQuickView  = (p) => { openQuickView(p); };

  return (
    <section className="section products" style={{ paddingTop: '80px' }}>
      <div className="container">

       
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Our Products</h1>
          <p style={{ color: '#888' }}>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
        </div>


        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px',
          alignItems: 'center', marginBottom: '28px',
          padding: '16px 20px', background: 'white',
          borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                border: '2px solid #e0e0e0', borderRadius: '8px',
                fontSize: '14px', outline: 'none',
              }}
            />
            <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
              🔍
            </span>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '7px 16px', borderRadius: '20px', border: 'none',
                fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                background: activeCategory === cat ? '#69ae14' : '#f0f0f0',
                color: activeCategory === cat ? 'white' : '#555',
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: '10px 14px', border: '2px solid #e0e0e0',
            borderRadius: '8px', fontSize: '14px', outline: 'none',
            background: 'white', cursor: 'pointer',
          }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>

          {/* Filter sidebar button */}
          <button onClick={openFilter} style={{
            padding: '10px 18px', background: '#222', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '600',
            fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="fa fa-sliders" /> Filters
          </button>
        </div>

       
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} style={{
              marginTop: '16px', padding: '10px 24px',
              background: '#69ae14', color: 'white', border: 'none',
              borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-layout">
            {filteredProducts.map(product => {
              const price = typeof product.price === 'string'
                ? product.price
                : `$${product.price}`;
              return (
                <div key={product.id} className="product">
                  <div className="img-container">
                    {product.image
                      ? <img src={product.image} alt={product.name} />
                      : <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f9e8', fontSize: '40px' }}>🛍️</div>
                    }

                    <div
                      className="addCart"
                      onClick={() => handleAddToCart({ ...product, price })}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fa fa-shopping-cart"></i>
                    </div>

                    <ul className="side-icons">
                      <span onClick={() => handleQuickView({ ...product, price })} style={{ cursor: 'pointer' }} title="Quick View">
                        <i className="fa fa-search"></i>
                      </span>
                      <span
                        onClick={() => handleWishlist({ ...product, price })}
                        style={{
                          cursor: 'pointer',
                          background: isInWishlist(product.id) ? '#ff4444' : '',
                          color: isInWishlist(product.id) ? 'white' : '',
                        }}
                        title="Wishlist"
                      >
                        <i className="fa fa-heart"></i>
                      </span>
                      <span onClick={openFilter} style={{ cursor: 'pointer' }} title="Filter">
                        <i className="fa fa-sliders"></i>
                      </span>
                    </ul>

                    {/* Category badge */}
                    {product.category && (
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'rgba(105,174,20,0.9)', color: 'white',
                        padding: '2px 10px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '600',
                      }}>
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div className="bottom">
                    <Link to="/product-details">{product.name}</Link>
                    <div className="price">
                      <span>{price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
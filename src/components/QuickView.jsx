import React from 'react';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/Cartcontext';
import { useWishlist } from '../context/WishlistContext';

const QuickView = () => {
  const { quickViewProduct, closeQuickView, openCart } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct);
    closeQuickView();
    openCart();
  };

  return (
    <div
      onClick={closeQuickView}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Close button */}
        <button onClick={closeQuickView} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'none', border: 'none',
          fontSize: '32px', cursor: 'pointer', color: '#666', lineHeight: 1,
        }}>×</button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
        }}>
          {/* Image */}
          <div style={{
            height: '350px', borderRadius: '15px',
            overflow: 'hidden', background: '#f5f5f5',
          }}>
            <img src={quickViewProduct.image} alt={quickViewProduct.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Details */}
          <div>
            <p style={{ color: '#69ae14', fontSize: '14px', marginBottom: '10px' }}>
              {quickViewProduct.category || 'Fresh Product'}
            </p>
            <h2 style={{ fontSize: '28px', marginBottom: '15px', lineHeight: 1.2 }}>
              {quickViewProduct.name}
            </h2>
            <div style={{ color: '#69ae14', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>
              {quickViewProduct.price}
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '30px' }}>
              Fresh and high-quality product sourced directly from local farms. 
              Perfect for your daily needs. Available for fast delivery.
            </p>

            <button onClick={handleAddToCart} style={{
              width: '100%', padding: '14px',
              background: '#69ae14', color: 'white',
              border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', marginBottom: '12px',
              transition: 'background 0.3s',
            }}>
              Add to Cart
            </button>

            <button onClick={() => toggleWishlist(quickViewProduct)} style={{
              width: '100%', padding: '14px',
              background: inWishlist ? '#ff4444' : '#f0f0f0',
              color: inWishlist ? 'white' : '#222',
              border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
              {inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
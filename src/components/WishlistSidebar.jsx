import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/Cartcontext';
import { useUI } from '../context/UIContext';

const WishlistSidebar = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { wishlistOpen, closeWishlist, openCart } = useUI();

  const handleAddToCart = (item) => {
    addToCart(item);
    openCart();
  };

  return (
    <>
      {/* Overlay */}
      {wishlistOpen && (
        <div
          onClick={closeWishlist}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1100,
          }}
        />
      )}
      <div style={{
        position: 'fixed',
        top: 0,
        right: wishlistOpen ? 0 : '-480px',
        width: '450px',
        maxWidth: '100vw',
        height: '100vh',
        background: 'white',
        boxShadow: '-5px 0 20px rgba(0,0,0,0.2)',
        zIndex: 1101,
        transition: 'right 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '25px',
          borderBottom: '2px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600' }}>
            Wishlist ({wishlist.length})
          </h2>
          <button onClick={closeWishlist} style={{
            background: 'none', border: 'none',
            fontSize: '28px', cursor: 'pointer', color: '#666', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>❤️</div>
              <h3 style={{ marginBottom: '10px' }}>Your wishlist is empty</h3>
              <p>Save your favourite products here!</p>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: '15px',
                marginBottom: '20px', padding: '15px',
                borderRadius: '10px', background: '#f9f9f9',
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '8px',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>{item.name}</h4>
                  <div style={{ color: '#69ae14', fontWeight: '600', fontSize: '16px', marginBottom: '12px' }}>
                    {item.price}
                  </div>
                  <button onClick={() => handleAddToCart(item)} style={{
                    width: '100%', padding: '8px',
                    background: '#69ae14', color: 'white',
                    border: 'none', borderRadius: '6px',
                    cursor: 'pointer', fontWeight: '600',
                    marginBottom: '8px',
                  }}>
                    Add to Cart
                  </button>
                  <button onClick={() => toggleWishlist(item)} style={{
                    background: 'none', border: 'none',
                    color: '#ff4444', cursor: 'pointer', fontSize: '13px',
                  }}>
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';
import { useUI } from '../context/UIContext';

const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { cartOpen, closeCart } = useUI();

  const total = getCartTotal();

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1100,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: cartOpen ? 0 : '-480px',
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
        {/* Header */}
        <div style={{
          padding: '25px',
          borderBottom: '2px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600' }}>
            Your Cart ({cart.reduce((c, i) => c + i.quantity, 0)})
          </h2>
          <button onClick={closeCart} style={{
            background: 'none', border: 'none',
            fontSize: '28px', cursor: 'pointer', color: '#666', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
              <h3 style={{ marginBottom: '10px' }}>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            cart.map(item => {
              const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace('$', ''))
                : item.price;
              return (
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
                    <div style={{ color: '#69ae14', fontWeight: '600', fontSize: '16px', marginBottom: '10px' }}>
                      ${price}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '28px', height: '28px', border: '1px solid #ddd',
                          background: 'white', borderRadius: '5px', cursor: 'pointer',
                          fontSize: '16px', fontWeight: '600',
                        }}>-</button>
                      <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '28px', height: '28px', border: '1px solid #ddd',
                          background: 'white', borderRadius: '5px', cursor: 'pointer',
                          fontSize: '16px', fontWeight: '600',
                        }}>+</button>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        = ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#ff4444', cursor: 'pointer', fontSize: '13px',
                      }}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '25px', borderTop: '2px solid #f0f0f0' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '20px', fontSize: '20px', fontWeight: '700',
            }}>
              <span>Total:</span>
              <span style={{ color: '#69ae14' }}>${total.toFixed(2)}</span>
            </div>
            <Link to="/cart" onClick={closeCart} style={{
              display: 'block', width: '100%', padding: '15px',
              background: '#69ae14', color: 'white', border: 'none',
              borderRadius: '10px', fontSize: '17px', fontWeight: '600',
              cursor: 'pointer', textAlign: 'center', marginBottom: '12px',
              textDecoration: 'none',
            }}>
              View Cart
            </Link>
            <Link to="/checkout" onClick={closeCart} style={{
              display: 'block', width: '100%', padding: '15px',
              background: '#222', color: 'white', border: 'none',
              borderRadius: '10px', fontSize: '17px', fontWeight: '600',
              cursor: 'pointer', textAlign: 'center',
              textDecoration: 'none',
            }}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
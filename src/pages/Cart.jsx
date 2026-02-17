import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="container cart" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ marginBottom: '15px' }}>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Add some products to get started!</p>
        <Link to="/products" style={{
          display: 'inline-block', padding: '12px 30px',
          background: '#69ae14', color: 'white',
          borderRadius: '30px', fontWeight: '600', textDecoration: 'none',
        }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            const price = typeof item.price === 'string'
              ? parseFloat(item.price.replace('$', ''))
              : item.price;
            return (
              <tr key={item.id}>
                <td>
                  <div className="cart-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span>Price: ${price.toFixed(2)}</span>
                      <br />
                      <a onClick={() => removeFromCart(item.id)} href="#" style={{ color: '#ff4444' }}>remove</a>
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>${(price * item.quantity).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="total-price">
        <table>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td>${total.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>$15.00</td>
            </tr>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>${(total + 15).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        <Link to="/checkout" className="checkout btn">Proceed To Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;
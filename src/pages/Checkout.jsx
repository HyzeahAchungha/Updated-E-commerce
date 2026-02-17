import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/Cartcontext';
import { CheckCircle, ArrowLeft, MapPin, Calendar } from 'lucide-react';

// const API_URL = process.env.REACT_APP_API_URL || 'https://achungha-server.onrender.com';

const inputCls = {
  width: '100%', padding: '12px 14px',
  border: '2px solid #e0e0e0', borderRadius: '10px',
  fontSize: '15px', outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    deliveryMethod: 'Pickup',
    date: '', address: '',
    city: '', country: 'Cameroon',
  });

  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [orderRef, setOrderRef] = useState('');

  const subtotal    = getCartTotal();
  const deliveryFee = form.deliveryMethod === 'Delivery' ? 15 : 0;
  const total       = subtotal + deliveryFee;

  // Min date: 48 h from now
  const minDate = new Date(Date.now() + 48 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = [];
    if (!form.fullName.trim())   errors.push('Full name is required');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.push('Valid email is required');
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9)
      errors.push('Valid phone number is required (min 9 digits)');
    if (!form.date)              errors.push('Delivery / pickup date is required');
    if (form.date && form.date < minDate)
      errors.push('Date must be at least 48 hours from now');
    if (form.deliveryMethod === 'Delivery' && !form.address.trim())
      errors.push('Delivery address is required');
    return errors;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (cart.length === 0) { setErrorMsg('Your cart is empty'); return; }
    const errors = validate();
    if (errors.length) { setErrorMsg(errors.join('\n')); return; }

    setErrorMsg('');
    setStatus('sending');

    const ref = `ACH-${Date.now().toString().slice(-6)}`;
    setOrderRef(ref);

    try {
      const res = await fetch(`${API_URL}/api/send-order-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: {
            fullName: form.fullName,
            email:    form.email,
            phone:    form.phone,
            address:  form.deliveryMethod === 'Delivery'
              ? `${form.address}, ${form.city}, ${form.country}`
              : `Pickup at store`,
            city:    form.city,
            country: form.country,
          },
          cart,
          total:        subtotal,
          deliveryFee,
          deliveryMethod: form.deliveryMethod,
          scheduledDate:  form.date,
          orderRef:       ref,
          orderDate:      new Date().toLocaleString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      clearCart();
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setStatus('error');
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: '#f9f9f9', paddingTop: '120px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'white', borderRadius: '24px',
            padding: '60px 40px', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            {/* Green check circle */}
            <div style={{
              width: '96px', height: '96px',
              background: '#e8f5e9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle size={56} color="#69ae14" />
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
              Order Received!
            </h1>
            <p style={{ color: '#555', fontSize: '17px', marginBottom: '6px' }}>
              Thank you, <strong style={{ color: '#69ae14' }}>{form.fullName}</strong>.
            </p>
            <p style={{ color: '#666', marginBottom: '32px', lineHeight: 1.7 }}>
              Check your email <strong>({form.email})</strong> for the confirmation and payment instructions.
            </p>

            {/* Payment instructions box */}
            <div style={{
              background: '#f0f9e8', border: '1px solid #c3e6a0',
              borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'left',
            }}>
              <h3 style={{ color: '#2e7d00', marginBottom: '12px', fontSize: '17px' }}>
                📧 Payment Instructions Sent!
              </h3>
              <p style={{ color: '#555', marginBottom: '16px', fontSize: '14px' }}>
                Check your email for payment details including our Mobile Money number.
              </p>
              <div style={{
                background: 'white', borderRadius: '12px',
                padding: '16px', border: '2px solid #a5d6a7', textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                  Order Reference
                </p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#69ae14' }}>
                  #{orderRef}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginTop: '8px' }}>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Important steps */}
            <div style={{
              background: '#fffde7', border: '1px solid #ffe082',
              borderRadius: '16px', padding: '24px', marginBottom: '32px', textAlign: 'left',
            }}>
              <h3 style={{ color: '#f57f17', marginBottom: '16px', fontSize: '16px' }}>
                ⚠️ Important Steps
              </h3>
              {[
                'Check your email for payment instructions',
                'Send payment using the Mobile Money details provided',
                `Use your name (${form.fullName}) as the reference`,
                "We'll begin preparing your order once payment is confirmed",
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  marginBottom: i < 3 ? '12px' : 0,
                }}>
                  <div style={{
                    width: '24px', height: '24px', background: '#f57f17',
                    color: 'white', borderRadius: '50%', fontSize: '12px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{step}</p>
                </div>
              ))}
            </div>

            <Link to="/" style={{
              display: 'inline-block', padding: '14px 40px',
              background: '#69ae14', color: 'white',
              borderRadius: '30px', fontWeight: '700',
              textDecoration: 'none', fontSize: '16px',
            }}>
              Back to Home
            </Link>
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#999' }}>
              Questions? Contact us at <strong>+237 678 000 000</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (cart.length === 0 && status !== 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '140px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ marginBottom: '12px' }}>Your cart is empty</h2>
        <Link to="/products" style={{
          display: 'inline-block', padding: '12px 30px',
          background: '#69ae14', color: 'white',
          borderRadius: '30px', fontWeight: '600', textDecoration: 'none',
        }}>
          Shop Now
        </Link>
      </div>
    );
  }

  // ── Checkout form ───────────────────────────────────────────────────────────
  return (
    <div style={{ marginTop: '90px', background: '#f9f9f9', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Back button */}
        <Link to="/cart" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#555', textDecoration: 'none', fontWeight: '500',
          marginBottom: '28px', fontSize: '15px',
        }}>
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '32px' }}>Checkout</h1>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px',
        }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Step 1 — Contact */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{
                  width: '32px', height: '32px', background: '#e8f5e9',
                  color: '#69ae14', borderRadius: '50%', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>1</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Contact Details</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Full Name *</label>
                  <input value={form.fullName} onChange={e => set('fullName', e.target.value)}
                    placeholder="John Doe" style={inputCls} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Phone *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+237 678 000 000" style={inputCls} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="john@example.com" style={inputCls} />
                <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                  Confirmation email & payment instructions sent here
                </p>
              </div>
            </div>

            {/* Step 2 — Delivery Method */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{
                  width: '32px', height: '32px', background: '#e8f5e9',
                  color: '#69ae14', borderRadius: '50%', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>2</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Delivery Method</h2>
              </div>

              {/* Pickup / Delivery toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {['Pickup', 'Delivery'].map(method => (
                  <button key={method} type="button"
                    onClick={() => set('deliveryMethod', method)}
                    style={{
                      padding: '14px', borderRadius: '12px', fontWeight: '600',
                      fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s',
                      border: form.deliveryMethod === method ? '2px solid #69ae14' : '2px solid #e0e0e0',
                      background: form.deliveryMethod === method ? '#e8f5e9' : 'white',
                      color: form.deliveryMethod === method ? '#69ae14' : '#555',
                    }}
                  >
                    {method === 'Pickup' ? '🏪 Pickup (Free)' : '🚚 Delivery (+$15)'}
                  </button>
                ))}
              </div>

              {/* Date picker */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  <Calendar size={15} /> Date Needed (Min 48h Notice) *
                </label>
                <input type="date" value={form.date} min={minDate}
                  onChange={e => set('date', e.target.value)}
                  style={inputCls} />
              </div>

              {/* Pickup info */}
              {form.deliveryMethod === 'Pickup' && (
                <div style={{
                  background: '#e8f5e9', borderRadius: '12px', padding: '16px',
                  display: 'flex', gap: '10px', border: '1px solid #c3e6a0',
                }}>
                  <MapPin size={20} color="#69ae14" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: '600', color: '#2e7d00', marginBottom: '4px' }}>Pickup Location:</p>
                    <p style={{ color: '#555', fontSize: '14px' }}>Achungha Store, Buea, Cameroon</p>
                    <p style={{ color: '#555', fontSize: '13px' }}>📞 Call +237 678 000 000 upon arrival</p>
                  </div>
                </div>
              )}

              {/* Delivery address */}
              {form.deliveryMethod === 'Delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Delivery Address *
                    </label>
                    <textarea value={form.address} onChange={e => set('address', e.target.value)}
                      placeholder="Enter your full address with landmarks"
                      rows={3}
                      style={{ ...inputCls, resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>City</label>
                      <input value={form.city} onChange={e => set('city', e.target.value)}
                        placeholder="Buea" style={inputCls} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Country</label>
                      <select value={form.country} onChange={e => set('country', e.target.value)} style={inputCls}>
                        <option>Cameroon</option>
                        <option>Nigeria</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                        <option>South Africa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 — Payment */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '32px', height: '32px', background: '#e8f5e9',
                  color: '#69ae14', borderRadius: '50%', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>3</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Payment</h2>
              </div>

              <div style={{
                background: '#e3f2fd', border: '1px solid #90caf9',
                borderRadius: '12px', padding: '16px', marginBottom: '12px',
              }}>
                <p style={{ fontWeight: '600', color: '#0d47a1', marginBottom: '8px' }}>
                  📱 Pay via Mobile Money
                </p>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '12px' }}>
                  Payment instructions will be sent to your email after placing order
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'white', padding: '4px 12px', borderRadius: '20px', border: '1px solid #90caf9', fontSize: '13px', color: '#0d47a1' }}>
                    🟠 Orange Money
                  </span>
                  <span style={{ background: 'white', padding: '4px 12px', borderRadius: '20px', border: '1px solid #90caf9', fontSize: '13px', color: '#0d47a1' }}>
                    🟡 MTN Mobile Money
                  </span>
                </div>
              </div>

              <div style={{
                background: '#fffde7', border: '1px solid #ffe082',
                borderRadius: '12px', padding: '14px',
              }}>
                <p style={{ color: '#f57f17', fontWeight: '600', fontSize: '14px' }}>
                  ⚠️ Payment validates your order — we begin preparing once confirmed.
                </p>
              </div>
            </div>

            {/* Error box */}
            {errorMsg && (
              <div style={{
                background: '#fff0f0', border: '1px solid #ffcccc',
                borderRadius: '10px', padding: '14px',
                color: '#cc0000', fontSize: '14px', whiteSpace: 'pre-line',
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={status === 'sending'}
              style={{
                width: '100%', padding: '18px',
                background: status === 'sending' ? '#aaa' : '#69ae14',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '18px', fontWeight: '700',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              {status === 'sending'
                ? <><span style={{ animation: 'spin 1s linear infinite' }}>⏳</span> Submitting Order...</>
                : `Place Order · $${total.toFixed(2)}`}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#999' }}>
              Payment instructions will be sent to your email
            </p>
          </div>

          {/* ── RIGHT COLUMN — Order Summary ──────────────────────────────── */}
          <div>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              position: 'sticky', top: '110px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Order Summary</h2>

              <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '16px' }}>
                {cart.map(item => {
                  const price = typeof item.price === 'string'
                    ? parseFloat(item.price.replace('$', ''))
                    : item.price;
                  return (
                    <div key={item.id} style={{
                      display: 'flex', gap: '12px', padding: '12px',
                      background: '#f9f9f9', borderRadius: '10px', marginBottom: '10px',
                    }}>
                      <div style={{ width: '55px', height: '55px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '3px' }}>{item.name}</p>
                        <p style={{ color: '#888', fontSize: '12px' }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ color: '#69ae14', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        ${(price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#555' }}>
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px', color: '#555' }}>
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '20px', fontWeight: '800',
                  borderTop: '3px solid #69ae14', paddingTop: '14px',
                  color: '#69ae14',
                }}>
                  <span style={{ color: '#222' }}>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{
                marginTop: '20px', padding: '14px',
                background: '#e8f5e9', borderRadius: '10px',
                border: '1px solid #c3e6a0', fontSize: '13px', color: '#555', lineHeight: '1.8',
              }}>
                📧 After placing your order:<br />
                ✅ You'll receive a confirmation email<br />
                ✅ The seller is notified instantly<br />
                ✅ Pay via Mobile Money to confirm
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
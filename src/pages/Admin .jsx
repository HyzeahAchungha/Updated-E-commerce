import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Simple password protection — change this to your own password
const ADMIN_PASSWORD = 'achungha2025';

const CATEGORIES = [ 'Juice', 'Fruits', 'Other'];

const emptyForm = {
  name: '', price: '', category: '', description: '', image: null, imagePreview: '',
};

const AdminPage = () => {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem('achungha_admin') === 'yes');
  const [password, setPassword]   = useState('');
  const [pwError, setPwError]     = useState('');

  const [products, setProducts]   = useState(() => {
    const saved = localStorage.getItem('achungha_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState(null);
  const [saved, setSaved]         = useState(false);
  const [tab, setTab]             = useState('add'); // 'add' | 'list'
  const fileRef                   = useRef();

  // Persist products to localStorage
  useEffect(() => {
    localStorage.setItem('achungha_products', JSON.stringify(products));
  }, [products]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('achungha_admin', 'yes');
      setAuthed(true);
    } else {
      setPwError('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('achungha_admin');
    setAuthed(false);
  };

  // ── Form handlers ──────────────────────────────────────────────────────────
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      set('image', ev.target.result);
      set('imagePreview', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.category) {
      alert('Please fill in Name, Price and Category.');
      return;
    }

    if (editId !== null) {
      // Update existing
      setProducts(prev => prev.map(p =>
        p.id === editId
          ? { ...p, name: form.name, price: form.price, category: form.category, description: form.description, image: form.image || p.image }
          : p
      ));
      setEditId(null);
    } else {
      // Add new
      const newProduct = {
        id: Date.now(),
        name: form.name,
        price: form.price.startsWith('$') ? form.price : `$${form.price}`,
        category: form.category,
        description: form.description,
        image: form.image || null,
        createdAt: new Date().toISOString(),
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    setForm(emptyForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setTab('list');
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.replace('$', ''),
      category: product.category,
      description: product.description || '',
      image: product.image,
      imagePreview: product.image,
    });
    setEditId(product.id);
    setTab('add');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f9f9f9',
      }}>
        <div style={{
          background: 'white', padding: '48px 40px', borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '72px', height: '72px', background: '#e8f5e9',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px',
          }}>🔐</div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ color: '#888', marginBottom: '28px' }}>Achungha Store Dashboard</p>

          <form onSubmit={handleLogin}>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%', padding: '14px', border: '2px solid #e0e0e0',
                borderRadius: '10px', fontSize: '16px', marginBottom: '12px',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            {pwError && (
              <p style={{ color: '#cc0000', fontSize: '13px', marginBottom: '12px' }}>⚠️ {pwError}</p>
            )}
            <button type="submit" style={{
              width: '100%', padding: '14px', background: '#69ae14',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            }}>
              Login
            </button>
          </form>
          <Link to="/" style={{ display: 'block', marginTop: '20px', color: '#888', fontSize: '14px' }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>

      {/* Header */}
      <div style={{
        background: '#222', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>🌿</span>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>
            Achungha <span style={{ color: '#69ae14' }}>Admin</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/products" style={{ color: '#aaa', fontSize: '14px', textDecoration: 'none' }}>
            View Store ↗
          </Link>
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid #555', color: '#aaa',
            padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#69ae14' }}>{products.length}</span>
            <span style={{ color: '#888', fontSize: '14px', marginLeft: '6px' }}>Total Products</span>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#69ae14' }}>
              {[...new Set(products.map(p => p.category))].length}
            </span>
            <span style={{ color: '#888', fontSize: '14px', marginLeft: '6px' }}>Categories</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: '#e0e0e0', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
          {[{ key: 'add', label: editId ? '✏️ Edit Product' : '➕ Add Product' }, { key: 'list', label: `📦 Products (${products.length})` }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              background: tab === t.key ? 'white' : 'transparent',
              color: tab === t.key ? '#222' : '#666',
              boxShadow: tab === t.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Success banner */}
        {saved && (
          <div style={{
            background: '#e8f5e9', border: '1px solid #a5d6a7',
            borderRadius: '10px', padding: '14px 20px',
            color: '#2e7d00', fontWeight: '600', marginBottom: '20px',
          }}>
            ✅ Product saved successfully!
          </div>
        )}

        {/* ── ADD / EDIT FORM ──────────────────────────────────────────────── */}
        {tab === 'add' && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px',
          }}>
            {/* Form */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Product Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Achungha Mini Backpack"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Price *</label>
                  <input value={form.price} onChange={e => set('price', e.target.value)}
                    placeholder="150"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none' }}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Brief product description..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              {/* Image upload */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: '2px dashed #c0d9b0', borderRadius: '10px',
                    padding: '24px', textAlign: 'center', cursor: 'pointer',
                    background: '#f0f9e8', transition: 'border-color 0.2s',
                  }}
                >
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="preview"
                      style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>📷</div>
                      <p style={{ color: '#69ae14', fontWeight: '600', marginBottom: '4px' }}>Click to upload image</p>
                      <p style={{ color: '#888', fontSize: '13px' }}>JPG, PNG, WEBP supported</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*"
                    onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
                {form.imagePreview && (
                  <button onClick={() => { set('image', null); set('imagePreview', ''); }}
                    style={{ marginTop: '8px', background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontSize: '13px' }}>
                    ✕ Remove image
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSave} style={{
                  flex: 1, padding: '14px', background: '#69ae14',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                }}>
                  {editId ? '💾 Save Changes' : '➕ Add Product'}
                </button>
                {editId && (
                  <button onClick={handleCancel} style={{
                    padding: '14px 20px', background: '#f0f0f0',
                    color: '#555', border: 'none', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#888' }}>Live Preview</h3>
              <div style={{
                background: 'white', borderRadius: '16px',
                overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                maxWidth: '280px',
              }}>
                <div style={{ height: '200px', background: '#f0f9e8', overflow: 'hidden' }}>
                  {form.imagePreview
                    ? <img src={form.imagePreview} alt="preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🛍️</div>
                  }
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '6px', color: '#222' }}>
                    {form.name || 'Product Name'}
                  </p>
                  {form.category && (
                    <span style={{
                      fontSize: '12px', background: '#e8f5e9', color: '#69ae14',
                      padding: '2px 10px', borderRadius: '20px', fontWeight: '600',
                    }}>{form.category}</span>
                  )}
                  <p style={{ color: '#69ae14', fontWeight: '800', fontSize: '20px', marginTop: '8px' }}>
                    ${form.price || '0.00'}
                  </p>
                  {form.description && (
                    <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.5, marginTop: '6px' }}>
                      {form.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCT LIST ─────────────────────────────────────────────────── */}
        {tab === 'list' && (
          <div>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ marginBottom: '8px' }}>No products yet</h3>
                <p style={{ color: '#888', marginBottom: '20px' }}>Add your first product to get started</p>
                <button onClick={() => setTab('add')} style={{
                  padding: '12px 28px', background: '#69ae14', color: 'white',
                  border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                }}>
                  ➕ Add Product
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                  <div key={product.id} style={{
                    background: 'white', borderRadius: '14px',
                    overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s',
                  }}>
                    <div style={{ height: '180px', background: '#f5f5f5', overflow: 'hidden', position: 'relative' }}>
                      {product.image
                        ? <img src={product.image} alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🛍️</div>
                      }
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: '#69ae14', color: 'white',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      }}>
                        {product.category}
                      </span>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{product.name}</h3>
                      <p style={{ color: '#69ae14', fontWeight: '800', fontSize: '18px', marginBottom: '12px' }}>
                        {product.price}
                      </p>
                      {product.description && (
                        <p style={{ color: '#888', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>
                          {product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(product)} style={{
                          flex: 1, padding: '8px', background: '#e8f5e9',
                          color: '#69ae14', border: 'none', borderRadius: '8px',
                          fontWeight: '600', cursor: 'pointer', fontSize: '13px',
                        }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} style={{
                          flex: 1, padding: '8px', background: '#fff0f0',
                          color: '#cc0000', border: 'none', borderRadius: '8px',
                          fontWeight: '600', cursor: 'pointer', fontSize: '13px',
                        }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
import React, { useState } from 'react';
import { useUI } from '../context/UIContext';

const FilterSidebar = () => {
  const { filterOpen, closeFilter } = useUI();

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'default',
  });

  const handleApply = () => {
   
    closeFilter();
  };

  const handleClear = () => {
    setFilters({ category: 'all', priceRange: 'all', sortBy: 'default' });
  };

  const FilterOption = ({ label, group, value }) => {
    const active = filters[group] === value;
    return (
      <div
        onClick={() => setFilters(f => ({ ...f, [group]: value }))}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px', marginBottom: '8px',
          borderRadius: '8px', cursor: 'pointer',
          background: active ? '#e8f5e9' : 'transparent',
          border: active ? '2px solid #69ae14' : '2px solid transparent',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: '20px', height: '20px',
          borderRadius: '50%', border: '2px solid #69ae14',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {active && (
            <div style={{
              width: '10px', height: '10px',
              borderRadius: '50%', background: '#69ae14',
            }} />
          )}
        </div>
        <span style={{ fontSize: '15px', color: active ? '#222' : '#555' }}>{label}</span>
      </div>
    );
  };

  return (
    <>
      {filterOpen && (
        <div
          onClick={closeFilter}
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
        right: filterOpen ? 0 : '-480px',
        width: '420px',
        maxWidth: '100vw',
        height: '100vh',
        background: 'white',
        boxShadow: '-5px 0 20px rgba(0,0,0,0.2)',
        zIndex: 1101,
        transition: 'right 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '25px',
          borderBottom: '2px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky', top: 0, background: 'white', zIndex: 1,
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Filter Products</h2>
          <button onClick={closeFilter} style={{
            background: 'none', border: 'none',
            fontSize: '28px', cursor: 'pointer', color: '#666', lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '15px', color: '#222' }}>Category</h3>
            <FilterOption label="All Categories" group="category" value="all" />
            <FilterOption label="Juice" group="category" value="Juice" />
            <FilterOption label="Mango" group="category" value="Mango" />
            <FilterOption label="Grapes" group="category" value="Grapes" />
            <FilterOption label="Potato" group="category" value="Potato" />
            <FilterOption label="Orange" group="category" value="Orange" />
            <FilterOption label="Pineapple" group="category" value="Pineapple" />
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '15px', color: '#222' }}>Price Range</h3>
            <FilterOption label="All Prices" group="priceRange" value="all" />
            <FilterOption label="Under $150" group="priceRange" value="low" />
            <FilterOption label="$150 – $200" group="priceRange" value="medium" />
            <FilterOption label="Over $200" group="priceRange" value="high" />
          </div>

          {/* Sort By */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '15px', color: '#222' }}>Sort By</h3>
            <FilterOption label="Default" group="sortBy" value="default" />
            <FilterOption label="Price: Low to High" group="sortBy" value="price-low" />
            <FilterOption label="Price: High to Low" group="sortBy" value="price-high" />
            <FilterOption label="Name A–Z" group="sortBy" value="name" />
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '20px',
          borderTop: '2px solid #f0f0f0',
          display: 'flex', gap: '15px',
          position: 'sticky', bottom: 0, background: 'white',
        }}>
          <button onClick={handleClear} style={{
            flex: 1, padding: '12px',
            background: '#f0f0f0', color: '#222',
            border: 'none', borderRadius: '8px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>
            Clear All
          </button>
          <button onClick={handleApply} style={{
            flex: 1, padding: '12px',
            background: '#69ae14', color: 'white',
            border: 'none', borderRadius: '8px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
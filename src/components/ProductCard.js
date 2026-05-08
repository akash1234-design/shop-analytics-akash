import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      width: '260px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      <img 
        src={product.image} 
        alt={product.name}
        style={{ 
          width: '100%', 
          height: '180px', 
          objectFit: 'cover', 
          borderRadius: '6px' 
        }}
      />
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        display: 'inline-block', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        fontSize: '12px', 
        marginTop: '8px' 
      }}>
        {product.category}
      </div>
      <h3 style={{ margin: '8px 0 5px 0', fontSize: '18px' }}>
        {product.name}
      </h3>
      <p style={{ 
        color: '#666', 
        fontSize: '14px', 
        minHeight: '40px' 
      }}>
        {product.description}
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '12px' 
      }}>
        <span style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#2e7d32' 
        }}>
          ₹{product.price}
        </span>
        <button 
          onClick={() => onAddToCart(product)}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
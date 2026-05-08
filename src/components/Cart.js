import React from 'react';

const Cart = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={{
      border: '2px solid #1976d2',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px auto',
      maxWidth: '700px',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>🛒 Shopping Cart: {totalItems} items</h2>
      
      {cartItems.length === 0 ? (
        <p>Cart is empty. Add some products!</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              borderBottom: '1px solid #ddd',
              backgroundColor: '#fff',
              marginBottom: '8px',
              borderRadius: '4px'
            }}>
              <div style={{ flex: 1 }}>
                <strong>{item.name}</strong> - ₹{item.price}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  style={{ padding: '5px 10px', cursor: 'pointer' }}
                >-</button>
                
                <span style={{ minWidth: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{ padding: '5px 10px', cursor: 'pointer' }}
                >+</button>
                
                <button 
                  onClick={() => onRemoveFromCart(item.id)}
                  style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 style={{ textAlign: 'right', marginTop: '20px' }}>
            Total: ₹{totalPrice}
          </h3>
        </>
      )}
    </div>
  );
};

export default Cart;
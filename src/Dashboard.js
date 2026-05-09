import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ user }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSale, setNewSale] = useState({ month: '', sales: '', profit: '', orders: '' });

  // Sign Out Function
  const handleSignOut = () => {
    signOut(auth);
  };

  // Data Fetch Karna
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'monthlySales'), orderBy('month', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  // Data Add Karna
  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'monthlySales'), {
        month: newSale.month,
        sales: Number(newSale.sales),
        profit: Number(newSale.profit),
        orders: Number(newSale.orders),
        userId: user.uid,
        createdAt: new Date()
      });
      setNewSale({ month: '', sales: '', profit: '', orders: '' });
      setShowForm(false);
      fetchSalesData(); // Data refresh kar
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Data add nahi hua. Console check kar.');
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Total Calculate Karna
  const totalSales = salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalProfit = salesData.reduce((sum, item) => sum + (item.profit || 0), 0);
  const totalOrders = salesData.reduce((sum, item) => sum + (item.orders || 0), 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 30px', 
        background: '#fff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <img src={user?.photoURL} alt="profile" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
          <div>
            <h2 style={{margin: 0, fontSize: '18px'}}>Shop Analytics</h2>
            <p style={{margin: 0, fontSize: '14px', color: '#666'}}>Welcome, {user?.displayName}</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          style={{
            padding: '10px 20px', 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>TOTAL SALES</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0088FE' }}>₹{totalSales.toLocaleString()}</p>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>TOTAL PROFIT</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#00C49F' }}>₹{totalProfit.toLocaleString()}</p>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>TOTAL ORDERS</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#FFBB28' }}>{totalOrders.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Data Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px', 
            background: '#0088FE', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Monthly Data'}
        </button>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAddSale} style={{ background: 'white', padding: '25px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="Month - Jan 2024" 
                value={newSale.month}
                onChange={(e) => setNewSale({...newSale, month: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input 
                type="number" 
                placeholder="Sales Amount" 
                value={newSale.sales}
                onChange={(e) => setNewSale({...newSale, sales: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input 
                type="number" 
                placeholder="Profit Amount" 
                value={newSale.profit}
                onChange={(e) => setNewSale({...newSale, profit: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input 
                type="number" 
                placeholder="Total Orders" 
                value={newSale.orders}
                onChange={(e) => setNewSale({...newSale, orders: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Save Data
            </button>
          </form>
        )}

        {/* Charts */}
        {loading ? (
          <div style={{textAlign: 'center', padding: '50px'}}>Loading data...</div>
        ) : salesData.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', background: 'white', borderRadius: '10px'}}>
            <h3>No data yet</h3>
            <p>Click "Add Monthly Data" button to add your first entry</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Sales & Profit Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="profit" stroke="#00C49F" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Monthly Orders</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#FFBB28" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
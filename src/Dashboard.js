import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

function Dashboard({ user }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSale, setNewSale] = useState({ month: '', sales: '', profit: '', orders: '', customers: '' });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleSignOut = () => {
    signOut(auth);
  };

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

  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'monthlySales'), {
        month: newSale.month,
        sales: Number(newSale.sales),
        profit: Number(newSale.profit),
        orders: Number(newSale.orders),
        customers: Number(newSale.customers),
        createdAt: new Date()
      });
      setNewSale({ month: '', sales: '', profit: '', orders: '', customers: '' });
      setShowForm(false);
      fetchSalesData();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Data add nahi hua. Console check kar.');
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const totalSales = salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalProfit = salesData.reduce((sum, item) => sum + (item.profit || 0), 0);
  const totalOrders = salesData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const totalCustomers = salesData.reduce((sum, item) => sum + (item.customers || 0), 0);

  const pieData = [
    { name: 'Profit', value: totalProfit },
    { name: 'Expenses', value: totalSales - totalProfit }
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header - Pro Look */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 32px', 
        background: '#ffffff', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          {/* Pro Logo + Avatar */}
          <div style={{
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            {user?.displayName?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b'}}>Shop Analytics Pro</h2>
            <p style={{margin: 0, fontSize: '14px', color: '#64748b'}}>{user?.displayName}</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          style={{
            padding: '10px 20px', 
            background: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#dc2626'}
          onMouseOut={(e) => e.target.style.background = '#ef4444'}
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Stats Cards - Pro Design */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { title: 'TOTAL REVENUE', value: `₹${totalSales.toLocaleString()}`, color: '#3b82f6', icon: '💰' },
            { title: 'NET PROFIT', value: `₹${totalProfit.toLocaleString()}`, color: '#10b981', icon: '📈' },
            { title: 'TOTAL ORDERS', value: totalOrders.toLocaleString(), color: '#f59e0b', icon: '📦' },
            { title: 'CUSTOMERS', value: totalCustomers.toLocaleString(), color: '#8b5cf6', icon: '👥' }
          ].map((card, idx) => (
            <div key={idx} style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '16px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>{card.title}</p>
                <span style={{fontSize: '24px'}}>{card.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Add Data Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontWeight: '600',
            fontSize: '15px',
            boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)'
          }}
        >
          {showForm ? '✕ Close' : '+ Add Monthly Data'}
        </button>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAddSale} style={{ 
            background: 'white', 
            padding: '28px', 
            borderRadius: '16px', 
            marginBottom: '32px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '20px', color: '#1e293b'}}>Add New Record</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <input type="text" placeholder="Month - 2024-01" value={newSale.month}
                onChange={(e) => setNewSale({...newSale, month: e.target.value})} required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Sales Amount" value={newSale.sales}
                onChange={(e) => setNewSale({...newSale, sales: e.target.value})} required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Profit Amount" value={newSale.profit}
                onChange={(e) => setNewSale({...newSale, profit: e.target.value})} required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Total Orders" value={newSale.orders}
                onChange={(e) => setNewSale({...newSale, orders: e.target.value})} required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Customers" value={newSale.customers}
                onChange={(e) => setNewSale({...newSale, customers: e.target.value})} required
                style={{ padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            </div>
            <button type="submit" style={{ 
              marginTop: '20px', 
              padding: '12px 28px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Save Record
            </button>
          </form>
        )}

        {/* Charts Grid */}
        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px'}}>Loading analytics...</div>
        ) : salesData.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px'}}>
            <h3 style={{color: '#1e293b'}}>No data available</h3>
            <p style={{color: '#64748b'}}>Add your first monthly record to see analytics</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px'}}>
            
            {/* Area Chart - Revenue Trend */}
            <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '18px' }}>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <YAxis stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px'}} />
                  <Legend />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Sales" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Orders & Customers */}
            <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '18px' }}>Orders vs Customers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <YAxis stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px'}} />
                  <Legend />
                  <Bar dataKey="orders" fill="#f59e0b" name="Orders" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="customers" fill="#8b5cf6" name="Customers" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Profit Distribution */}
            <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '18px' }}>Profit Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Growth */}
            <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '18px' }}>Growth Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <YAxis stroke="#94a3b8" style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px'}} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{r: 5}} name="Sales" />
                  <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={3} dot={{r: 5}} name="Customers" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
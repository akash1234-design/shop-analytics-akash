import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

function Dashboard({ user }) {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [products, setProducts] = useState([]);
  const [totals, setTotals] = useState({ sales: 0, profit: 0, orders: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const [showMonthForm, setShowMonthForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newMonth, setNewMonth] = useState({ month: '', sales: '', profit: '', orders: '', customers: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', image: '' });
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const salesSnapshot = await getDocs(collection(db, 'monthlyStats'));
      const sales = salesSnapshot.docs.map(doc => doc.data()).sort((a, b) => a.month.localeCompare(b.month));
      setSalesData(sales);

      const totalSales = sales.reduce((sum, item) => sum + Number(item.sales), 0);
      const totalProfit = sales.reduce((sum, item) => sum + Number(item.profit), 0);
      const totalOrders = sales.reduce((sum, item) => sum + Number(item.orders), 0);
      const totalCustomers = sales.reduce((sum, item) => sum + Number(item.customers), 0);
      setTotals({ sales: totalSales, profit: totalProfit, orders: totalOrders, customers: totalCustomers });

      const categorySnapshot = await getDocs(collection(db, 'categories'));
      const categories = categorySnapshot.docs.map(doc => doc.data());
      setCategoryData(categories);

      const productSnapshot = await getDocs(collection(db, 'products'));
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMonth = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'monthlyStats'), {
        month: newMonth.month,
        sales: Number(newMonth.sales),
        profit: Number(newMonth.profit),
        orders: Number(newMonth.orders),
        customers: Number(newMonth.customers)
      });
      setShowMonthForm(false);
      setNewMonth({ month: '', sales: '', profit: '', orders: '', customers: '' });
      fetchData();
      alert('Month data added!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category: newProduct.category,
        image: newProduct.image || 'https://via.placeholder.com/100'
      });
      setShowProductForm(false);
      setNewProduct({ name: '', price: '', stock: '', category: '', image: '' });
      fetchData();
      alert('Product added!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  if (loading) return <div style={theme.loading}>Loading Dashboard...</div>;

  return (
    <div style={theme.container}>
      <div style={theme.header}>
        <div>
          <h1 style={theme.title}>ShopAnalytics Dashboard</h1>
          <p style={theme.subtitle}>Real-time business insights</p>
        </div>
        <div style={theme.userSection}>
          <button onClick={() => setDarkMode(!darkMode)} style={theme.themeBtn}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span style={theme.userEmail}>{user.email}</span>
          <button onClick={handleLogout} style={theme.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={theme.statsGrid}>
        <StatCard title="Total Sales" value={`₹${totals.sales.toLocaleString()}`} color="#8884d8" theme={theme} />
        <StatCard title="Total Profit" value={`₹${totals.profit.toLocaleString()}`} color="#82ca9d" theme={theme} />
        <StatCard title="Total Orders" value={totals.orders.toLocaleString()} color="#ffc658" theme={theme} />
        <StatCard title="Total Products" value={products.length} color="#ff8042" theme={theme} />
      </div>

      <div style={theme.actionBar}>
        <button onClick={() => setShowMonthForm(!showMonthForm)} style={theme.addBtn}>
          {showMonthForm ? '✕ Cancel' : '+ Add Month Data'}
        </button>
        <button onClick={() => setShowProductForm(!showProductForm)} style={{...theme.addBtn, background: '#722ed1', marginLeft: '10px'}}>
          {showProductForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {showMonthForm && (
        <form onSubmit={handleAddMonth} style={theme.form}>
          <h3 style={theme.formTitle}>Add Monthly Data</h3>
          <div style={theme.formGrid}>
            <input type="text" placeholder="Month (e.g. May)" value={newMonth.month} 
              onChange={e => setNewMonth({...newMonth, month: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Sales" value={newMonth.sales} 
              onChange={e => setNewMonth({...newMonth, sales: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Profit" value={newMonth.profit} 
              onChange={e => setNewMonth({...newMonth, profit: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Orders" value={newMonth.orders} 
              onChange={e => setNewMonth({...newMonth, orders: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Customers" value={newMonth.customers} 
              onChange={e => setNewMonth({...newMonth, customers: e.target.value})} style={theme.input} required />
          </div>
          <button type="submit" style={theme.submitBtn}>Save Month</button>
        </form>
      )}

      {showProductForm && (
        <form onSubmit={handleAddProduct} style={theme.form}>
          <h3 style={theme.formTitle}>Add New Product</h3>
          <div style={theme.formGrid}>
            <input type="text" placeholder="Product Name" value={newProduct.name} 
              onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Price" value={newProduct.price} 
              onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={theme.input} required />
            <input type="number" placeholder="Stock" value={newProduct.stock} 
              onChange={e => setNewProduct({...newProduct, stock: e.target.value})} style={theme.input} required />
            <input type="text" placeholder="Category (e.g. Electronics)" value={newProduct.category} 
              onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={theme.input} required />
            <input type="text" placeholder="Image URL (optional)" value={newProduct.image} 
              onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={theme.input} />
          </div>
          <button type="submit" style={theme.submitBtn}>Save Product</button>
        </form>
      )}

      <div style={theme.chartsGrid}>
        <div style={theme.chartCard}>
          <h3 style={theme.chartTitle}>Monthly Sales & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
              <XAxis dataKey="month" stroke={theme.textColor} />
              <YAxis stroke={theme.textColor} />
              <Tooltip contentStyle={theme.tooltip} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} name="Sales" dot={{ r: 5 }} />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={3} name="Profit" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={theme.chartCard}>
          <h3 style={theme.chartTitle}>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} 
                label={({name, value}) => `${name}: ${value}`}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={theme.tooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={theme.tableCard}>
        <h3 style={theme.chartTitle}>Product Inventory - {products.length} Items</h3>
        <div style={theme.tableWrapper}>
          <table style={theme.table}>
            <thead>
              <tr>
                <th style={theme.th}>Image</th>
                <th style={theme.th}>Product Name</th>
                <th style={theme.th}>Category</th>
                <th style={theme.th}>Price</th>
                <th style={theme.th}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="5" style={theme.tdCenter}>No products yet. Click "Add Product" to create one.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} style={theme.tr}>
                    <td style={theme.td}><img src={product.image} alt={product.name} style={theme.productImg} /></td>
                    <td style={theme.td}>{product.name}</td>
                    <td style={theme.td}>{product.category}</td>
                    <td style={theme.td}>₹{product.price?.toLocaleString()}</td>
                    <td style={theme.td}>
                      <span style={{...theme.stockBadge, background: product.stock > 20 ? '#52c41a' : product.stock > 0 ? '#faad14' : '#ff4d4f'}}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color, theme }) => (
  <div style={{...theme.statCard, borderTop: `4px solid ${color}`}}>
    <p style={theme.statTitle}>{title}</p>
    <p style={theme.statValue}>{value}</p>
  </div>
);

const lightTheme = {
  container: { padding: '20px', fontFamily: 'Segoe UI, sans-serif', background: '#f5f7fa', minHeight: '100vh', transition: 'all 0.3s' },
  loading: { textAlign: 'center', marginTop: '100px', fontSize: '24px', color: '#666' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  title: { margin: 0, fontSize: '32px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '14px' },
  userSection: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  userEmail: { color: '#555', fontSize: '14px' },
  themeBtn: { padding: '8px 16px', cursor: 'pointer', background: '#f0f0f0', border: '1px solid #d9d9d9', borderRadius: '6px', fontWeight: '600' },
  logoutBtn: { padding: '10px 20px', cursor: 'pointer', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' },
  statCard: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  statTitle: { margin: 0, color: '#666', fontSize: '14px', fontWeight: '500' },
  statValue: { margin: '12px 0 0 0', fontSize: '32px', fontWeight: '700', color: '#1a1a1a' },
  actionBar: { marginBottom: '20px' },
  addBtn: { padding: '12px 24px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  form: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' },
  formTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#1a1a1a' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' },
  input: { padding: '10px', border: '1px solid #d9d9d9', borderRadius: '6px', fontSize: '14px' },
  submitBtn: { padding: '10px 30px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '20px' },
  chartCard: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  chartTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#1a1a1a' },
  gridColor: '#e0e0e0',
  textColor: '#666',
  tooltip: { background: '#fff', border: '1px solid #ccc', borderRadius: '6px' },
  tableCard: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#666', fontWeight: '600', fontSize: '14px' },
  td: { padding: '12px', borderBottom: '1px solid #f0f0f0', color: '#333' },
  tdCenter: { padding: '20px', textAlign: 'center', color: '#999' },
  tr: { transition: 'background 0.2s' },
  productImg: { width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' },
  stockBadge: { padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: '600' }
};

const darkTheme = {
  container: { padding: '20px', fontFamily: 'Segoe UI, sans-serif', background: '#141414', minHeight: '100vh', transition: 'all 0.3s' },
  loading: { textAlign: 'center', marginTop: '100px', fontSize: '24px', color: '#ccc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  title: { margin: 0, fontSize: '32px', color: '#fff' },
  subtitle: { margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' },
  userSection: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  userEmail: { color: '#ccc', fontSize: '14px' },
  themeBtn: { padding: '8px 16px', cursor: 'pointer', background: '#2a2a2a', color: '#fff', border: '1px solid #434343', borderRadius: '6px', fontWeight: '600' },
  logoutBtn: { padding: '10px 20px', cursor: 'pointer', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' },
  statCard: { background: '#1f1f1f', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  statTitle: { margin: 0, color: '#aaa', fontSize: '14px', fontWeight: '500' },
  statValue: { margin: '12px 0 0 0', fontSize: '32px', fontWeight: '700', color: '#fff' },
  actionBar: { marginBottom: '20px' },
  addBtn: { padding: '12px 24px', background: '#177ddc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  form: { background: '#1f1f1f', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', marginBottom: '20px' },
  formTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#fff' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' },
  input: { padding: '10px', border: '1px solid #434343', borderRadius: '6px', fontSize: '14px', background: '#141414', color: '#fff' },
  submitBtn: { padding: '10px 30px', background: '#49aa19', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '20px' },
  chartCard: { background: '#1f1f1f', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  chartTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#fff' },
  gridColor: '#303030',
  textColor: '#aaa',
  tooltip: { background: '#1f1f1f', border: '1px solid #434343', borderRadius: '6px', color: '#fff' },
  tableCard: { background: '#1f1f1f', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #303030', color: '#aaa', fontWeight: '600', fontSize: '14px' },
  td: { padding: '12px', borderBottom: '1px solid #303030', color: '#ddd' },
  tdCenter: { padding: '20px', textAlign: 'center', color: '#777' },
  tr: { transition: 'background 0.2s' },
  productImg: { width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' },
  stockBadge: { padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: '600' }
};

export default Dashboard;

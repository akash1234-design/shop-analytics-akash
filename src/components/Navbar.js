import React from 'react'

const Navbar = () => {
  return (
    <div style={{
      backgroundColor: '#1e293b', 
      padding: '15px 30px', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <h2 style={{margin: 0}}>Shop Analytics</h2>
      <div>
        <span style={{marginRight: '20px'}}>Home</span>
        <span>Dashboard</span>
      </div>
    </div>
  )
}

export default Navbar
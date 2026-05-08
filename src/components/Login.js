import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // ← Yaha ../ lagaya

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email aur password dono daalo');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('New user created & logged in');
        } catch (signUpError) {
          setError(signUpError.message);
        }
      } else if (err.code === 'auth/wrong-password') {
        setError('Password galat hai');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email format galat hai');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Google login successful');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>ShopAnalytics Login</h2>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={googleButtonStyle}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            style={{ width: '20px', marginRight: '10px' }}
          />
          Continue with Google
        </button>

        <div style={dividerStyle}>OR</div>

        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          
          {error && <p style={errorStyle}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={loginButtonStyle}
          >
            {loading ? 'Loading...' : 'Login / Sign Up'}
          </button>
        </form>
        
        <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Naya user hai? Email/Password daalo, account apne aap ban jayega
        </p>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f2f5'
};

const boxStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
};

const googleButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  marginBottom: '20px'
};

const dividerStyle = {
  textAlign: 'center',
  margin: '20px 0',
  color: '#999'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
  boxSizing: 'border-box'
};

const loginButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#1877f2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginBottom: '15px',
  textAlign: 'center'
};

export default Login;
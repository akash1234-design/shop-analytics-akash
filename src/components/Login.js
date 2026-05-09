import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "./firebase"; // Tera firebase config import
import './Login.css'; // Optional CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success");
      // Redirect hoga automatically agar App.js me onAuthStateChanged laga hai
    } catch (err) {
      console.log("Login Error:", err.message);
      if (err.code === 'auth/user-not-found') {
        setError('Ye email register nahi hai. Sign Up karo pehle.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password galat hai.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email sahi nahi hai.');
      } else {
        setError('Login failed. Dobara try karo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup Function
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye.');
      setLoading(false);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup Success");
    } catch (err) {
      console.log("Signup Error:", err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ye email pehle se use me hai. Login karo.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password bahut weak hai. Strong password daalo.');
      } else {
        setError('Signup failed. Dobara try karo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login Function
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google Login Success");
    } catch (err) {
      console.log("Google Error:", err.message);
      setError('Google se login nahi ho paya. Dobara try karo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ShopAnalytics Login</h2>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="google-btn"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            width="20"
          />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form>
          <input 
            type="email" 
            placeholder="Email daalo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password daalo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <div className="btn-group">
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="login-btn"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            
            <button 
              onClick={handleSignup} 
              disabled={loading}
              className="signup-btn"
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="info-text">
          Naya user hai? Email/Password daalo aur Sign Up dabao
        </p>
      </div>
    </div>
  );
}

export default Login;
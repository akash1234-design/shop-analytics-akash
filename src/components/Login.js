import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Ye email register nahi hai. Sign Up karo.");
      } else if (err.code === "auth/wrong-password") {
        setError("Password galat hai.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email format sahi nahi hai.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      setLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Ye email pehle se use me hai. Login karo.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code === "auth/unauthorized-domain") {
        setError("Domain allow nahi hai. Firebase me localhost add karo.");
      } else {
        setError("Google login failed: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ShopAnalytics</h2>
        <p style={styles.subtitle}>Login to your account</p>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={styles.googleBtn}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            style={styles.googleIcon}
          />
          Continue with Google
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.btnGroup}>
          <button 
            onClick={handleLogin} 
            disabled={loading}
            style={{...styles.btn, ...styles.loginBtn}}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <button 
            onClick={handleSignup} 
            disabled={loading}
            style={{...styles.btn, ...styles.signupBtn}}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '28px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '14px'
  },
  googleBtn: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '16px',
    marginBottom: '20px'
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    position: 'relative'
  },
  dividerText: {
    background: 'white',
    padding: '0 15px',
    color: '#999',
    fontSize: '12px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  btn: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold'
  },
  loginBtn: {
    background: '#4CAF50'
  },
  signupBtn: {
    background: '#2196F3'
  }
};

export default Login;
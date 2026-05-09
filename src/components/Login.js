import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase"; // firebase.js src folder me hai to ../ use kar

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Ye email register nahi hai. Sign Up karo pehle.");
      } else if (err.code === "auth/wrong-password") {
        setError("Password galat hai.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email sahi nahi hai.");
      } else {
        setError("Login failed. Dobara try karo.");
      }
    }
    setLoading(false);
  };

  // Signup Function
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
      } else if (err.code === "auth/weak-password") {
        setError("Password weak hai. Strong password daalo.");
      } else {
        setError("Signup failed. Dobara try karo.");
      }
    }
    setLoading(false);
  };

  // Google Login Function
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("Google se login nahi ho paya. Dobara try karo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>ShopAnalytics Login</h2>
      
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        style={{ width: "100%", padding: "12px", marginBottom: "20px" }}
      >
        Continue with Google
      </button>

      <div style={{ textAlign: "center", margin: "20px 0" }}>OR</div>

      <form>
        <input 
          type="email" 
          placeholder="Email daalo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />
        <input 
          type="password" 
          placeholder="Password daalo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button 
            onClick={handleLogin} 
            disabled={loading}
            style={{ flex: 1, padding: "12px", background: "#4CAF50", color: "white", border: "none" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          
          <button 
            onClick={handleSignup} 
            disabled={loading}
            style={{ flex: 1, padding: "12px", background: "#2196F3", color: "white", border: "none" }}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
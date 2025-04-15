import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import '../../assets/css/login.css'; // Include CSS for styling
import { Link } from 'react-router-dom';
import { fireStore } from '../../config/firebase'; // Firestore import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(fireStore, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role; // Get the role field from Firestore

        // Check if the user has the 'admin' role
        if (userRole === 'admin') {
          // If user is an admin, navigate to the InstitutionPage
          setLoading(false);
          navigate('/institutionpage');
        } else {
          // If user is not an admin, redirect to a different page
          setError('You do not have the necessary permissions to access this page.');
          setLoading(false);
        }
      } else {
        setError('User not found in database.');
        setLoading(false);
      }
    } catch (error) {
      setError('Invalid email or password'); // Custom error message
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Display error message if there is an error */}
        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={loading} className='loginbutton'>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p>Forgot Password? <a href="/forgot-password">Reset here</a></p>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default Login;

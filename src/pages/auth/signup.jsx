import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { fireStore, storage } from '../../config/firebase' // Correct Firebase import
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Spin, Modal } from 'antd'; // Ant Design components
import '../../assets/css/signup.css'; // Include CSS for styling
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalVisible, setModalVisible] = useState(true); // For modal visibility
  const navigate = useNavigate();

  // Handle logo upload change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    try {
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let logoUrl = '';
      if (logo) {
        // Upload logo to Firebase Storage
        const logoRef = ref(storage, `logos/${user.uid}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      // Add user details to Firestore
      await setDoc(doc(fireStore, 'users', user.uid), {
        email: user.email,
        institution: institution,
        role: 'user', // Default role set to 'user'
        contactNumber: contactNumber,
        address: address,
        logo: logoUrl,
      });

      setSuccess('Signup successful! You can now log in.');
      setError('');
      setLoading(false);

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
        window.scrollTo(0, 0);
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSuccess('');
      setLoading(false);
    }
  };

  // Close modal after the user reads the instructions
  const handleModalOk = () => {
    setModalVisible(false);
  };

  return (
    <div className="signup-container">
      {/* Modal with instructions */}
      <Modal
        title="Signup Instructions"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="Got it"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Follow the instructions below to complete the signup process:</p>
        <ul>
          <li>Enter your all credentials to create an account.</li>
          <li>Provide the institution name, contact number, and address.</li>
          <li>Upload the institution's logo (if available).</li>
          <li>Once you submit the information. Pay the required amount to get pdfs with your institution name and logo, After the payment you will get access to all required pdfs.</li>
        </ul>
      </Modal>

      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <div className="form-group">
          <label>Institution Name</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <p style={{ color: 'red' }}>
          The institution name, address, and logo will be printed on all required PDF files.
        </p>

        {/* Display error message if any */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display success message if signup is successful */}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={loading} className='buttonsignup'>
          {loading ? <Spin size="small" /> : 'Sign Up'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;

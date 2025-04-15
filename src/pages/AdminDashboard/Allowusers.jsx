import React, { useState, useEffect } from 'react';
import { fireStore } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import '../../assets/css/allowusers.css';

const AllowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(fireStore, "users"));
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const userRef = doc(fireStore, "users", userId);
    
    await updateDoc(userRef, { role: newRole });
    
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="allow-users-container">
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Institution</th>
            <th>Logo</th>
            <th>Contact Number</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.institution}</td>
              <td>{user.logo}</td>
              <td>{user.contactNumber}</td>
              <td>{user.role}</td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={user.role === 'admin'}
                    onChange={() => handleRoleToggle(user.id, user.role)}
                  />
                  Admin
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllowUsers;


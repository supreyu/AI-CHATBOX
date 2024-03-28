import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '', 
    email: '', 
    password: '', 
    birthday: '', 
    gender: '', 
    is_admin: ''
  });

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (response.ok) {
        alert('User updated successfully');
        navigate('/admin/edit-users');
      } else {
        alert('Failed to update user');
      }
    })
    .catch(error => {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user');
    });
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}/>
        </label>
        <br />
        <label>
            Email:
            <input type="email" name="email" value={user.email} onChange={handleInputChange} />
        </label>
        <br />
        <label>
            Password:
            <input type="password" name="password" value={user.password} onChange={handleInputChange} />
        </label>
        <br />
        <label>
            Birthday:
            <input type="date" name="birthday" value={user.birthday} onChange={handleInputChange} />
        </label>
        <br />
        <label>
            Gender:
            <select name="gender" value={user.gender} onChange={handleInputChange}>
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
        </label>
        <br />
        <label>
            Is Admin:
            <select name="is_admin" value={user.is_admin} onChange={handleInputChange}>
              <option value="">Select...</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
        </label>
        <br />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default UpdateUser;


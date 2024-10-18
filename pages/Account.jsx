import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Button } from "../src/components/ui/button"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"

const apiurl = import.meta.env.VITE_API_URL;

export default function Account() {
  const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '' });
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiurl}/auth/users/me/`, {
          headers: { Authorization: `JWT ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        setServerError('An error occurred while fetching user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${apiurl}/auth/users/me/`, {
        method: 'PUT',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully');
        setServerError('');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setServerError('An error occurred while updating the profile');
    }
  };

  return (
    <Card className="mx-auto mt-40 max-w-lg">
      <CardHeader>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </CardHeader>
      <CardContent>
        {serverError && <p className="text-red-500">{serverError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form className="space-y-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={userData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={userData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </form>
        <div className="mt-5">
          <h2 className="text-lg font-semibold">Email</h2>
          <p>{userData.email}</p>
          <Button onClick={() => navigate('/reset-email')} className="mt-2">Reset Email</Button>
        </div>
        <Button onClick={() => navigate('/reset-password')} className="w-full mt-3">Reset Password</Button>
        <Button
          className="w-full mt-3 bg-red-600 text-white hover:bg-red-700"
          onClick={() => navigate('/delete-account')}
        >
          Delete Account
        </Button>
        <Button
          className="w-full mt-3"
          variant="secondary"
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
          }}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Button } from "../src/components/ui/button"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"
const apiurl = import.meta.env.VITE_API_URL;

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${apiurl}/auth/users/me/`, {
        method: 'DELETE',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password: password }),
      });

      if (response.status === 204) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('Account deleted successfully');
        navigate('/register');
      } else {
        setErrorMessage('Failed to delete account. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to delete account. Please try again.');
    }
  };

  return (
    <Card className="mx-auto mt-60 max-w-md">
      <CardHeader>
        <h1 className="text-xl font-bold text-center">Delete Account</h1>
      </CardHeader>
      <CardContent>
        <form>
          <div className="mb-4">
            <Label htmlFor="password">Current Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Button
            className="w-full bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
          <Button
            className="w-full mt-3"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;

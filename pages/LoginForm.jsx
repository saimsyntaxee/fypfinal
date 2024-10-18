import { useState, useEffect } from "react";

import { Button } from "../src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"
import { useNavigate ,Link} from "react-router-dom"


const apiurl = import.meta.env.VITE_API_URL;

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [tokens, setTokens] = useState({
    access: typeof window !== 'undefined' ? localStorage.getItem("access_token") : null,
    refresh: typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("token_expiry");
    if (tokenExpiry && new Date().getTime() > tokenExpiry) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      setTokens({ access: null, refresh: null });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(`${apiurl}/auth/jwt/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const { access, refresh } = await response.json();
          const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; 
          setTokens({ access, refresh });
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
          localStorage.setItem("token_expiry", expiryTime);
          setServerError("");
          navigate("/account");
        } else {
          const errorData = await response.json();
          setServerError(errorData.detail || "An error occurred");
        }
      } catch (error) {
        setServerError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="mx-auto max-w-lg mt-32">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/reset-password" className="ml-auto text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {errors.password && <p>{errors.password}</p>}
            </div>
            {serverError && <p>{serverError}</p>}
            <Button type="submit" className="w-full" disabled={Object.keys(errors).length > 0}>
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

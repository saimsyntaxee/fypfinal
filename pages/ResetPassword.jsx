import { useState } from "react";
import { Button } from "../src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"
import { useNavigate } from "react-router-dom"

const apiurl = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiurl}/send_reset_code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        navigate(`/verify-reset-code/${email}`);
      } else {
        setError("Failed to send reset code.");
      }
    } catch (error) {
      setError("An error occurred while processing the password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-60">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

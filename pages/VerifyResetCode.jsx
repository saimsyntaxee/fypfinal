import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Button } from "../src/components/ui/button"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"
import { useNavigate } from "react-router-dom"

const apiurl = import.meta.env.VITE_API_URL;

export default function VerifyResetCode() {
  const { email } = router.query;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiurl}/verify_reset_code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        const { uid, token } = await response.json();
        setSuccess(true);
        setTimeout(() => navigate(`/reset-password-confirm/${uid}/${token}`), 2000);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while verifying the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-5">
      <CardHeader>
        <CardTitle>Verify Reset Code</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Code verified successfully. Redirecting...</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Verification Code</Label>
              <p>An email has been sent to {email} for the verification code!</p>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

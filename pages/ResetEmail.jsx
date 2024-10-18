import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Button } from "../src/components/ui/button"
import { Input } from '../src/components/ui/input'
import { Label } from "../src/components/ui/label"
import { useNavigate } from "react-router-dom"

const apiurl = import.meta.env.VITE_API_URL;

export default function ResetEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailReset = async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiurl}/auth/users/set_email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
          current_password: password,
        }),
      });

      if (response.status === 204) {
        setSuccessMessage("Email reset successfully. Redirecting...");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setErrorMessage("Failed to reset email. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while resetting the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-40">
      <CardHeader>
        <CardTitle>Reset Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <Button onClick={handleEmailReset} className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
        <Button variant="secondary" className="mt-3 w-full" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}

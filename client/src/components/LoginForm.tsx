import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const LoginForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    try {
        const response = await axios.post("http://localhost:8000/login/", {
            email: formData.email,
            password: formData.password,
        });

        console.log("Login successful:", response.data);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("isAdmin", response.data.is_admin);

        if (response.data.is_admin) {
          navigate('/adashboard');
        }
        else {
          navigate('/vdashboard');
        }

    } catch (error) {
        console.error("Login failed:", error);
        setError("Login failed. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <Card className="bg-black text-white border border-gray-700 w-full max-w-sm shadow-lg mt-10">
        <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        
          <Button className="w-full bg-white text-black hover:bg-gray-300 rounded" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="text-center">
        <p className="text-sm text-gray-400 mx-auto">
          Don't have an account?{" "}
          <a href="/signup" className="text-white underline hover:text-gray-300">
            Sign Up
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}

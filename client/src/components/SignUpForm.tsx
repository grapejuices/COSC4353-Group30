import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SignUpForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordC: "",
        isAdmin: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value });
    };

    const handleToggle = (checked: boolean) => {
        setFormData({ ...formData, isAdmin: checked });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.passwordC) {
            setError("Passwords do not match.")
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/register/", {
                email: formData.email,
                password: formData.password,
                is_admin: formData.isAdmin
            });

            console.log("Signup successful:", response.data);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            if (response.data.user.is_admin) {
                navigate('/adashboard');
            }
            else {
                navigate('/profile');
            }

        } catch (error) {
            console.error("Signup failed:", error);
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-black text-white border border-gray-700 w-full max-w-sm shadow-lg mt-10">
            <CardHeader>
                <CardTitle className="text-center text-xl font-bold">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="passwordC" className="text-white">Confirm Password</Label>
                        <Input
                            id="passwordC"
                            type="password"
                            placeholder="Confirm your password"
                            className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
                            value={formData.passwordC}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md border border-gray-600">
                        <Label htmlFor="admin" className="text-white">
                            Admin User
                        </Label>
                        <Switch id="admin" checked={formData.isAdmin} onCheckedChange={handleToggle} />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <Button className="w-full bg-white text-black hover:bg-gray-300 rounded" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </form>
            </CardContent>
        
            <CardFooter className="text-center">
                <p className="text-sm text-gray-400 mx-auto">
                    Already have an account?{" "}
                    <a href="/" className="text-white underline hover:text-gray-300">
                        Login
                    </a>
                </p>
            </CardFooter>
        </Card>
  )
}

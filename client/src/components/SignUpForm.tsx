import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from Lucide React
import { useAuth } from "@/AuthProvider";

export const SignUpForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordC: "",
        isAdmin: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Check password strength when the password field changes
        if (id === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleToggle = (checked: boolean) => {
        setFormData({ ...formData, isAdmin: checked });
    };

    const checkPasswordStrength = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return "Password must be at least 8 characters long.";
        }
        if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!hasLowerCase) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!hasNumbers) {
            return "Password must contain at least one number.";
        }
        if (!hasSpecialChars) {
            return "Password must contain at least one special character.";
        }
        return "Password is strong!";
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.passwordC) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Check if the password meets the strength requirements
        if (passwordStrength !== "Password is strong!") {
            setError(passwordStrength);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/register/", {
                email: formData.email,
                password: formData.password,
                is_admin: formData.isAdmin,
            });

            console.log("Signup successful:", response.data);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("isAdmin", response.data.is_admin);

            login(response.data.access, response.data.refresh, response.data.is_admin);

            if (response.data.user.is_admin) {
                navigate("/adashboard");
            } else {
                navigate("/profile");
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
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
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

                    <div className="relative">
                        <Label htmlFor="password" className="text-white">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            placeholder="Enter your password"
                            className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500 pr-10"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                        {passwordStrength && (
                            <p
                                className={`text-sm mt-1 ${
                                    passwordStrength === "Password is strong!"
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                {passwordStrength}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Label htmlFor="passwordC" className="text-white">
                            Confirm Password
                        </Label>
                        <Input
                            id="passwordC"
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            placeholder="Confirm your password"
                            className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500 pr-10"
                            value={formData.passwordC}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
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
    );
};

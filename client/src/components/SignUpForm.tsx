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
import { BACKEND_URL } from "@/lib/config";

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
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false, 
        number: false,
        special: false,
        isStrong: false
    });
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Check password strength when the password field changes
        if (id === "password") {
            checkPasswordStrength(value);
        }
    };

    const handleToggle = (checked: boolean) => {
        setFormData({ ...formData, isAdmin: checked });
    };

    const checkPasswordStrength = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        
        const isStrong = Object.values(requirements).every(req => req);
        
        setPasswordRequirements({
            ...requirements,
            isStrong
        });
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
        if (!passwordRequirements.isStrong) {
            setError("Password doesn't meet all requirements.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/signup/`, {
                email: formData.email,
                password: formData.password,
                is_admin: formData.isAdmin,
            });

            console.log("Signup successful:", response.data);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("isAdmin", response.data.is_admin);

            login(response.data.access, response.data.refresh, response.data.is_admin);

            if (response.data.is_admin) {
                navigate("/adashboard");
            } else {
                navigate("/vdashboard");
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

                    <div>
                        <Label htmlFor="password" className="text-white">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500 pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        
                        {formData.password && (
                            <div className="mt-2 text-sm">
                                {passwordRequirements.isStrong ? (
                                    <p className="text-green-500">Password is strong!</p>
                                ) : (
                                    <div>
                                        <p className="text-amber-500 mb-1">Password requirements:</p>
                                        <ul className="space-y-1">
                                            <li className={passwordRequirements.length ? "text-green-500" : "text-red-500"}>
                                                {passwordRequirements.length ? "✓" : "×"} At least 8 characters
                                            </li>
                                            <li className={passwordRequirements.uppercase ? "text-green-500" : "text-red-500"}>
                                                {passwordRequirements.uppercase ? "✓" : "×"} At least one uppercase letter
                                            </li>
                                            <li className={passwordRequirements.lowercase ? "text-green-500" : "text-red-500"}>
                                                {passwordRequirements.lowercase ? "✓" : "×"} At least one lowercase letter
                                            </li>
                                            <li className={passwordRequirements.number ? "text-green-500" : "text-red-500"}>
                                                {passwordRequirements.number ? "✓" : "×"} At least one number
                                            </li>
                                            <li className={passwordRequirements.special ? "text-green-500" : "text-red-500"}>
                                                {passwordRequirements.special ? "✓" : "×"} At least one special character
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="passwordC" className="text-white">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="passwordC"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500 pr-10"
                                value={formData.passwordC}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
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
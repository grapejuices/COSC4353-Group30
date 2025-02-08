import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginForm = () => {
  return (
    <Card className="bg-black text-white border border-gray-700 w-full max-w-sm shadow-lg mt-10">
        <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 bg-gray-800 text-white border-gray-600 focus:ring-gray-500"
            />
          </div>
        
          <Button className="w-full bg-white text-black hover:bg-gray-300 rounded">
            Login
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

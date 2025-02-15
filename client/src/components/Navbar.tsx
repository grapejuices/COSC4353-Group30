import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationCenter } from "./NotificationSystem";

export const Navbar = () => {
    const location = useLocation();

    const isLoginPage = location.pathname === '/';
    const buttonText = isLoginPage ? "Sign Up" : "Login";
    const buttonLink = isLoginPage ? "/signup" : "/";

    return (
        <nav className='bg-black text-white p-4'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/' className='text-xl font-bold text-white'>
                    VolunteerMatch
                </Link>

                <NavigationMenu>
                    <NavigationMenuList className='flex space-x-4 items-center'>
                        <NavigationMenuItem>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                        <Bell className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4" align="end">
                                    <NotificationCenter />
                                </PopoverContent>
                            </Popover>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Button asChild variant='outline' className='text-white border-white bg-black rounded'>
                                <Link to={buttonLink}>{buttonText}</Link>
                            </Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    )
}

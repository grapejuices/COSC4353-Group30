import { Link, useLocation } from "react-router-dom";
import { Bell, X } from "lucide-react";
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
// import { NotificationCenter } from "./NotificationSystem";
import { useAuth } from "@/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


interface Notification {
    id: number;
    message: string;
    user_profile: number;
}

export const Navbar = () => {
    const location = useLocation();
    const { logout, isAdmin, isAuth } = useAuth();

    const isLoginPage = location.pathname === '/';
    const buttonText = isLoginPage ? "Sign Up" : "Login";
    const buttonLink = isLoginPage ? "/signup" : "/";

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifcations = async () => {
            try {
                const response = await axios.get('http://localhost:1111/notifications/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                });
                setNotifications(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (isAuth && !isAdmin) {
            fetchNotifcations();
        }
    }, [location]);

    const handleNotificationDelete = async (notificationId: number) => {
        try {
            await axios.delete('http://localhost:1111/notifications/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                data: {
                    id: notificationId,
                }
            })
            setNotifications((prevNotifications) => {
                return prevNotifications.filter(notification => notification.id !== notificationId);
            })
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }

    return (
        <nav className='bg-black text-white p-4'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/' className='text-xl font-bold text-white'>
                    VolunteerMatch
                </Link>

                <NavigationMenu>
                    <NavigationMenuList className='flex space-x-4 items-center'>
                        <NavigationMenuItem>
                            {(isAuth && !isAdmin) ? ( 
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white">
                                            <Bell className="h-5 w-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4" align="end">
                                        {notifications.length > 0 ? (
                                            notifications.map((notifications) => (
                                                <Card key={notifications.id} className="mb-2">
                                                    <CardHeader>
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle>Notification</CardTitle>
                                                            <Button className="text-black hover:bg-white" variant="ghost" size="icon" onClick={() => handleNotificationDelete(notifications.id)}>
                                                                <X />
                                                            </Button>
                                                        </div>
                                                        
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p>{notifications.message}</p>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : 
                                            <p className="text-center">No notifications.</p>
                                        }
                                    </PopoverContent>
                                </Popover>) : null
                            }
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            {isAuth ? (
                                <>
                                    <Button asChild className="text-white border-white bg-black rounded">
                                        <Link to={isAdmin ? '/adashboard' : 'vdashboard'}> 
                                            Dashboard 
                                        </Link>
                                    </Button>
                                    <Button asChild variant='outline' className="text-white border-white bg-black rounded" onClick={logout}>
                                        <Link to="/">Logout</Link>
                                    </Button>
                                </>   
                            ) : (
                                <Button asChild variant='outline' className='text-white border-white bg-black rounded'>
                                    <Link to={buttonLink}>{buttonText}</Link>
                                </Button>
                            )}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    )
}

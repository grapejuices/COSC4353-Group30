import { useEffect, useState } from "react";
import axios from "axios";
import Select, { MultiValue } from "react-select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select as ShadSelect, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


interface Event {
    id: number;
    event_name: string;
    description: string;
    location: string;
    urgency: string;
    event_date: string;
    status: string;
    required_skills: { name: string }[];
}

const skillsOptions = [
    { value: "Cooking", label: "Cooking" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Gardening", label: "Gardening" },
    { value: "Teaching", label: "Teaching" },
    { value: "Driving", label: "Driving" },
];


export const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        id: 0,
        event_name: "",
        description: "",
        location: "",
        urgency: "Low",
        event_date: "",
        status: "Pending",
        skills: [] as string[],
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:1111/events/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setEvents(response.data);
            } catch (err) {
                setError("Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:1111/events/", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                },
            });
            setOpen(false);
            window.location.reload(); // Reload to fetch the new event
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:1111/events/${events.find((event) => event.id === formData.id)?.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json",
                },
            });
            window.location.reload(); // Reload to fetch the updated event
        } catch (error) {
            console.error("Error updating event:", error);
        }
    }

    const handleEditChange = async (selected: { value: number; label: string } | null) => {
        if (selected) {
            const event = events.find((e) => e.id === selected.value);
            if (event) {
                setFormData({
                    id: event.id,
                    event_name: event.event_name,
                    description: event.description,
                    location: event.location,
                    urgency: event.urgency,
                    event_date: new Date(event.event_date).toISOString().split("T")[0],
                    status: event.status,
                    skills: event.required_skills.map((skill) => skill.name),
                });
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };
    
    const handleMultiSelectChange = (selected: MultiValue<{ value: string; label: string }>) => {
        setFormData({ ...formData, skills: selected.map((skill) => skill.value) });
    };

    if (loading) return <p className="text-center text-gray-600">Loading events...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px' }}>
            <div style={{ flex: 1, overflow: 'auto', paddingRight: '10px' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Events List</CardTitle>
                        <Button onClick={() => setOpen(true)}>Create Event</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Urgency</TableHead>
                                    <TableHead>Required Skills</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.id}</TableCell>
                                        <TableCell>{event.event_name}</TableCell>
                                        <TableCell>{event.location}</TableCell>
                                        <TableCell>{new Date(event.event_date).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{event.status}</Badge>
                                        </TableCell>
                                        <TableCell>{event.urgency}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {event.required_skills.length > 0 ? (
                                                    event.required_skills.map((skill, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {skill.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400">No skills required</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                name="event_name"
                                placeholder="Event Name"
                                value={formData.event_name}
                                onChange={handleChange}
                            />
                            <Textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Input
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                            <ShadSelect onValueChange={(value) => handleSelectChange("urgency", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </ShadSelect>
                            <Input
                                name="event_date"
                                type="date"
                                value={formData.event_date}
                                onChange={handleChange}
                            />
                            <ShadSelect onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </ShadSelect>

                            <Select
                                isMulti
                                value={skillsOptions.filter((skill) => formData.skills.includes(skill.value))}
                                onChange={handleMultiSelectChange}
                                options={skillsOptions}
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Create Event</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div style={{ flex: 1, overflow: 'auto', paddingLeft: '10px' }}>
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle className="text-xl font-bold">Edit Event</CardTitle>
                            <Select
                                options={events.map((event) => ({ value: event.id, label: event.event_name }))}
                                onChange={handleEditChange}
                            ></Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <Input
                                name="event_name"
                                placeholder="Event Name"
                                value={formData.event_name}
                                onChange={handleChange}
                            />
                            <Textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Input
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                            <ShadSelect onValueChange={(value) => handleSelectChange("urgency", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </ShadSelect>
                            <Input
                                name="event_date"
                                type="date"
                                value={formData.event_date}
                                onChange={handleChange}
                            />
                            <ShadSelect onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </ShadSelect>

                            <Select
                                isMulti
                                value={skillsOptions.filter((skill) => formData.skills.includes(skill.value))}
                                onChange={handleMultiSelectChange}
                                options={skillsOptions}
                            />
                            <Button type="submit">Update Event</Button>

                        </form>
                    </CardContent>


                </Card>
            </div>
        </div>
    );
};

export default EventsPage;
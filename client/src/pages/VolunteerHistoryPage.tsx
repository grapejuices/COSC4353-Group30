import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VolunteerHistory {
    id: number;
    event: {
        id: number;
        event_name: string;
        description: string;
        location: string;
        urgency: string;
        event_date: string;
    };
    status: string;
    user_profile: number;
}

export const VolunteerHistoryPage = () => {
    const [history, setHistory] = useState<VolunteerHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const accessToken = localStorage.getItem("access_token");
            try {
                const response = await axios.get("http://localhost:1111/volunteer-history/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
            });
                console.log(response.data);
                setHistory(response.data);
            } catch (err) {
                setError("Failed to fetch volunteer history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading history...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">My Volunteer History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Urgency</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.event.event_name}</TableCell>
                                    <TableCell>{record.event.location}</TableCell>
                                    <TableCell>{new Date(record.event.event_date).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{record.status}</Badge>
                                    </TableCell>
                                    <TableCell>{record.event.urgency}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default VolunteerHistoryPage;
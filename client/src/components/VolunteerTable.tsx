"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BACKEND_URL } from "@/lib/config";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

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

interface VolunteerTableProps {
    onEditEvent: (event: Event) => void;
}

export const VolunteerTable: React.FC<VolunteerTableProps> = ({ onEditEvent }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const accessToken  = localStorage.getItem("access_token");

        const fetchEvents = async () => {
            try {
                axios.get(`${BACKEND_URL}/profile/`,{
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }).then((response) => {
                    axios.get(`${BACKEND_URL}/history/${response.data.id}/`,{
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            },
                    }).then((response) => {
                        console.log(response.data);


                        // setEvents(response.data);
                    setLoading(false);
                    }).catch((error) => {
                        console.error(error);
                        setError((error as any).message);
                        setLoading(false);
                  });
                }
                ).catch((error) => {
                    console.error(error);
                    setError((error as any).message);
                    setLoading(false);
                }
                );
            } catch (error) {
                console.error(error);
                setError((error as any).message);
                setLoading(false);
            }
        };
        

        fetchEvents();

    }
        , []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const customSortUrgency = (rowA: any, rowB: any) => {
        return rowA.original.urgency.localeCompare(rowB.original.urgency);
    };

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "event_name",
            header: "Event Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "skills",
            header: "Skills",
        },
        {
            accessorKey: "urgency",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Urgency
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            sortingFn: customSortUrgency,
        },
        {
            accessorKey: "event_date",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return new Date(row.original.event_date).toLocaleDateString();
            }
        },
    ]

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={events} />
        </div>
    )
}
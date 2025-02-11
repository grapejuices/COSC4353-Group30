"use client"

import { getData } from "@/lib/temporary_values";
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the type of the data
export type VolunteerEvent = {
    status: string
    id: string
    name: string
    description: string
    location: string
    skills: string[]
    urgency: string
    date: Date
    volunteer: string
}

interface EventTableProps {
    onEditEvent: (event: VolunteerEvent) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ onEditEvent }) => {
    const [data, setData] = useState<VolunteerEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Custom sorting function for urgency
    const urgencyOrder = ["Urgent", "High", "Medium", "Low"];
    const customSortUrgency = (rowA: any, rowB: any) => {
        return urgencyOrder.indexOf(rowA.original.urgency) - urgencyOrder.indexOf(rowB.original.urgency);
    };

    // Define the columns of the table
    const columns: ColumnDef<VolunteerEvent>[] = [
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEditEvent(row.original)}>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Delete Event</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
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
            accessorKey: "date",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "volunteer",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Volunteer
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
    ]

    return (
        <div className="container mx-auto py-10">
            <Button className="mb-4">Create Event</Button>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
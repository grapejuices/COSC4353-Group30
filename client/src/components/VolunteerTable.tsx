"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getEvents, urgencyLevels, VolunteerEvent } from "@/lib/temporary_values";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface VolunteerTableProps {
    onEditEvent: (event: VolunteerEvent) => void;
}

export const VolunteerTable: React.FC<VolunteerTableProps> = ({ onEditEvent }) => {
    const [data, setData] = useState<VolunteerEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getEvents();
            setData(result);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const customSortUrgency = (rowA: any, rowB: any) => {
        return urgencyLevels.indexOf(rowA.original.urgency) - urgencyLevels.indexOf(rowB.original.urgency);
    };

    const customSortVolunteer = (rowA: any, rowB: any) => {
        return rowA.original.volunteer.name.localeCompare(rowB.original.volunteer.name);
    }

    const columns: ColumnDef<VolunteerEvent>[] = [
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
            cell: ({ row }) => {
                return row.original.date.toLocaleDateString();
            }
        },
        // {
        //     accessorKey: "volunteer",
        //     header: ({ column }) => {
        //         return (
        //             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        //                 Volunteer
        //                 <ArrowUpDown className="ml-2 h-4 w-4" />
        //             </Button>
        //         )
        //     },
        //     sortingFn: customSortVolunteer,
        //     cell: ({ row }) => {
        //         return row.original.volunteer.name;
        //     }
        // },
    ]

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
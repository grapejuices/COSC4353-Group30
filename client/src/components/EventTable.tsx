"use client"


import { DataTable } from "@/components/ui/data-table"
import { useEffect, useState } from "react"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

// Define the columns of the table
export const columns: ColumnDef<VolunteerEvent>[] = [
    {
        id: "actions",

        // Just in case we need the row later
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
                        <DropdownMenuItem>Edit Event</DropdownMenuItem>
                        <DropdownMenuItem>Delete Event</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
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
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Urgency
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
]

// Fetch data from database
async function getData(): Promise<VolunteerEvent[]> {
    // Temporary data
    return [
        {
            status: "pending",
            id: "1",
            name: "Event 1",
            description: "Description 1",
            location: "Location 1",
            skills: ["Skill 1", "Skill 2"],
            urgency: "Urgent",
            date: new Date()
        },
        {
            status: "completed",
            id: "2",
            name: "Event 2",
            description: "Description 2",
            location: "Location 2",
            skills: ["Skill 3", "Skill 4"],
            urgency: "Urgent",
            date: new Date()
        },
        {
            status: "pending",
            id: "3",
            name: "Event 3",
            description: "Description 3",
            location: "Location 3",
            skills: ["Skill 5", "Skill 6"],
            urgency: "Urgent",
            date: new Date()
        },
        {
            status: "completed",
            id: "4",
            name: "Event 4",
            description: "Description 4",
            location: "Location 4",
            skills: ["Skill 7", "Skill 8"],
            urgency: "Urgent",
            date: new Date()
        },
        {
            status: "pending",
            id: "5",
            name: "Event 5",
            description: "Description 5",
            location: "Location 5",
            skills: ["Skill 9", "Skill 10"],
            urgency: "Urgent",
            date: new Date()
        }
    ]
}

export const EventTable = () => {
    const [data, setData] = useState<VolunteerEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData()
            setData(result)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto py-10">
            <Button className="mb-4">Create Event</Button>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
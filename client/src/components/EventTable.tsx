"use client"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { EventSheet } from "./EventForm";
import { createEvent, deleteEvent, getEvent, getEvents, urgencyLevels } from "@/lib/eventFunctions";

interface EventTableProps {
    onEditEvent: (event: any) => void;
    refreshKey?: number;
}

export const EventTable: React.FC<EventTableProps> = ({ onEditEvent, refreshKey = 0 }) => {
    const [data, setData] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [internalRefreshKey, setInternalRefreshKey] = useState(0);
    const [hideCompleted, setHideCompleted] = useState(false);

    const effectiveRefreshKey = refreshKey + internalRefreshKey;

    useEffect(() => {
        const fetchData = async () => {
            const result = await getEvents();
            setAllData(result);
            setData(hideCompleted ? result.filter(event => event.status !== "Completed") : result);
            setLoading(false);
        };
        fetchData();
    }, [hideCompleted, effectiveRefreshKey]);

    const refreshTable = () => {
        setInternalRefreshKey(prevKey => prevKey + 1);
    };

    // Custom sorting function for urgency
    const customSortUrgency = (rowA: any, rowB: any) => {
        return urgencyLevels.indexOf(rowA.original.urgency) - urgencyLevels.indexOf(rowB.original.urgency);
    };

    const customSortVolunteer = (rowA: any, rowB: any) => {
        const volA = rowA.original.volunteer;
        const volB = rowB.original.volunteer;

        if (!volA && !volB) return 0;
        if (!volA) return 1; // Null volunteers go last
        if (!volB) return -1;

        return volA.name.localeCompare(volB.name);
    };

    // Handle event deletion
    const handleDeleteEvent = async (event: any) => {
        try {
            await deleteEvent(event.id);
            setData(prevData => prevData.filter(e => e.id !== event.id));
            refreshTable();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // Define the columns of the table
    const columns: ColumnDef<any>[] = useMemo(() => [
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
                            <DropdownMenuItem onClick={() => handleDeleteEvent(row.original)}>Delete Event</DropdownMenuItem>
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
            cell: ({ row }) => {
                return new Date(row.original.event_date).toLocaleDateString();
            }
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
            sortingFn: customSortVolunteer,
            cell: ({ row }) => {
                // Standardize the text for consistency
                return row.original.volunteer?.full_name || "No Volunteer Assigned";
            }
        },
    ], [onEditEvent]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="hide-completed"
                            checked={hideCompleted}
                            onCheckedChange={(checked: any) => setHideCompleted(!!checked)}
                        />
                        <label
                            htmlFor="hide-completed"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Hide Completed Events
                        </label>
                    </div>
                    <CreateEventButton setData={setData} refreshTable={refreshTable} />
                </div>
            </div>
            <DataTable
                key={refreshKey}
                columns={columns}
                data={data}
                pagination={false}
            />
        </div>
    );
}

// Create event button props
interface CreateEventButtonProps {
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    refreshTable: () => void;
}

// Create a new event button
const CreateEventButton: React.FC<CreateEventButtonProps> = ({ setData, refreshTable }) => {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const handleSave = (savedEvent: any) => {
        // Update data in the table with saved event
        setData(prevData => {
            const updatedData = prevData.filter(event => event.id !== savedEvent.id);
            updatedData.push(savedEvent);

            // Force the table to refresh
            setTimeout(refreshTable, 0);

            return updatedData;
        });
    };

    return (
        <div>
            <Button onClick={() => onCreateNewEvent(setSelectedEvent, setData, refreshTable)}>
                Create Event
            </Button>
            <EventSheet
                selectedEvent={selectedEvent}
                closeSheet={() => setSelectedEvent(null)}
                onSave={handleSave}
            />
        </div>
    );
}

// Create a new event
async function onCreateNewEvent(
    setSelectedEvent: React.Dispatch<React.SetStateAction<any | null>>,
    setData: React.Dispatch<React.SetStateAction<any[]>>,
    refreshTable: () => void
) {
    // Create a new event
    const newVolunteerEvent = {
        event_name: "New Event",
        description: "New Event Description",
        location: "N/A",
        skills: [],
        urgency: 0,
        event_date: new Date(),
        status: 0,
    }

    let data = await createEvent(newVolunteerEvent);

    // Set the selected event to the new event
    setSelectedEvent(data);

    // Update the data state to include the new event
    setData(prevData => {
        const updatedData = [...prevData];
        // Remove any event with the same ID if it exists
        const filteredData = updatedData.filter(event => event.id !== data.id);

        // Add the new event
        filteredData.push(data);

        // Force the table to refresh
        setTimeout(refreshTable, 0);

        return filteredData;
    });
}
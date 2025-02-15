"use client"
import { Bell, Calendar, Info, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { VolunteerEvent, getEvents } from "@/lib/temporary_values"
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

export function NotificationCenter() {
  // State to store the list of events
  const [events, setEvents] = useState<VolunteerEvent[]>([])
  // State to manage loading status
  const [loading, setLoading] = useState(true)
  // State to handle errors during event fetching
  const [error, setError] = useState<string | null>(null)

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events from the API or local function
        const fetchedEvents = await getEvents()
        // Update the state with the fetched events
        setEvents(fetchedEvents)
      } catch (err) {
        // If an error occurs, set the error message
        setError("Failed to fetch events. Please try again later.")
      } finally {
        // Set loading to false once the fetch operation is complete
        setLoading(false)
      }
    }
    fetchEvents()
  }, []) // Empty dependency array ensures this runs only once on mount

  // Display a loading spinner while events are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Display an error message if fetching events fails
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Display a message if there are no events to show
  if (events.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Notifications</AlertTitle>
        <AlertDescription>You have no new notifications.</AlertDescription>
      </Alert>
    )
  }

  // Render the list of events
  return (
    <div className="space-y-4">
      {events.map((event) => {
        // Check if the event is urgent
        const isUrgent = event.urgency === "Critical" || event.urgency === "High"
        // Check if the event is pending
        const isPending = event.status === "Pending"
        
        // Render a notification for pending events
        if (isPending) {
          return (
            <Alert key={event.id} variant={isUrgent ? "destructive" : "default"}>
              <Bell className="h-4 w-4" />
              <AlertTitle>New Assignment</AlertTitle>
              <AlertDescription>
                You have been assigned to: {event.name}<br />
                Date: {event.date.toLocaleDateString()}<br />
                Urgency: {event.urgency}
              </AlertDescription>
            </Alert>
          )
        }

        // Render a notification for completed events
        if (event.status === "Completed") {
          return (
            <Alert key={event.id} variant="default">
              <Info className="h-4 w-4" />
              <AlertTitle>Event Completed</AlertTitle>
              <AlertDescription>
                Thank you for completing: {event.name}
              </AlertDescription>
            </Alert>
          )
        }

        // Return null for events that don't match any status (e.g., "Cancelled")
        return null
      })}
    </div>
  )
}
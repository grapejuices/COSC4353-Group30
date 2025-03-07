"use client"
// Import necessary icons and components
import { Bell, Calendar, Info, Loader2, BadgeAlert } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
// Import data models and functions
import { VolunteerEvent, getEvents, updateEvent } from "@/lib/temporary_values"
import * as React from "react"
// Import Popover primitive from Radix UI for dropdown functionality
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Create re-usable Popover components
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
// Custom implementation of PopoverContent with styling
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
        // Animation and style classes for the popover
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Export the Popover components for reuse
export { Popover, PopoverTrigger, PopoverContent }

/**
 * NotificationBell Component
 * 
 * A bell icon that displays the number of notifications and shows a popover with 
 * notification details when clicked.
 */
export function NotificationBell() {
  // State for event data
  const [events, setEvents] = useState<VolunteerEvent[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<VolunteerEvent[]>([])
  // UI state management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  // Calculate the total number of notifications to display as a badge
  const notificationCount = events.length + upcomingEvents.length

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get all events from the database or temporary data
        const fetchedEvents = await getEvents()
        
        // Update the state with the fetched events
        setEvents(fetchedEvents)
        
        // Filter for upcoming events (within the next 2 days) that need reminders
        const now = new Date()
        const twoDaysFromNow = new Date(now)
        twoDaysFromNow.setDate(now.getDate() + 2)
        
        // Only show reminders for pending events that have a volunteer assigned
        // and are happening within the next two days
        const upcoming = fetchedEvents.filter(event => {
          return event.status === "Pending" && 
                 event.volunteer && 
                 event.date > now && 
                 event.date < twoDaysFromNow
        })
        
        setUpcomingEvents(upcoming)
      } catch (err) {
        setError("Failed to fetch events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, []) // Empty dependency array ensures this runs only once on mount

  // Function to handle event updates and send notifications
  const handleEventUpdate = async (eventId: string, updatedFields: Partial<VolunteerEvent>) => {
    try {
      const updatedEvent = await updateEvent(eventId, updatedFields)
      if (updatedEvent) {
        // Send update notification
        await sendNotification(updatedEvent, "update")
        // Refresh the event list
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)
      }
    } catch (err) {
      setError("Failed to update event")
    }
  }

  // Function to send notifications
  const sendNotification = async (event: VolunteerEvent, type: "assignment" | "update" | "reminder") => {
    const { volunteer, name, date, location } = event

    if (!volunteer || !volunteer.email) {
      console.error("No volunteer or email found for event:", event.id)
      return
    }

    let subject = ""
    let message = ""

    switch (type) {
      case "assignment":
        subject = "New Event Assignment"
        message = `You have been assigned to: ${name}\nDate: ${date.toLocaleDateString()}\nLocation: ${location}`
        break
      case "update":
        subject = "Event Update"
        message = `The event "${name}" has been updated.\nNew Date: ${date.toLocaleDateString()}\nNew Location: ${location}`
        break
      case "reminder":
        subject = "Upcoming Event Reminder"
        message = `Don't forget your upcoming event: ${name}\nDate: ${date.toLocaleDateString()}\nLocation: ${location}`
        break
      default:
        console.error("Invalid notification type")
        return
    }

    // Send email notification (mock implementation)
    console.log(`Sending email to ${volunteer.email}: ${subject} - ${message}`)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* Bell icon trigger with notification count badge */}
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Only show the badge if there are notifications */}
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 rounded-full bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      {/* Notification popover content */}
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto p-0">
        {/* Header section */}
        <div className="p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        {/* Notification content */}
        <div className="p-2">
          <NotificationCenter 
            events={events} 
            upcomingEvents={upcomingEvents} 
            loading={loading} 
            error={error} 
            onEventUpdate={handleEventUpdate}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Interface for NotificationCenter props
 */
interface NotificationCenterProps {
  events: VolunteerEvent[]       // All events that need notifications
  upcomingEvents: VolunteerEvent[] // Events that need reminders
  loading: boolean               // Loading state while fetching data
  error: string | null           // Error message if fetch fails
  onEventUpdate: (eventId: string, updatedFields: Partial<VolunteerEvent>) => void // Callback for event updates
}

/**
 * NotificationCenter Component
 * 
 * Displays notifications for various event types and statuses.
 * Shows loading states, error messages, and empty states as needed.
 */
export function NotificationCenter({
  events = [],
  upcomingEvents = [],
  loading = false,
  error = null,
  onEventUpdate
}: NotificationCenterProps) {
  // Display a loading spinner while events are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
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
  if (events.length === 0 && upcomingEvents.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <BadgeAlert className="mx-auto h-8 w-8 mb-2" />
        <p>No new notifications</p>
      </div>
    )
  }

  // Render the list of events based on their status
  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2">
      {/* Map through all events and display appropriate notifications based on status */}
      {events.map((event) => {
        // Check if the event is urgent (Critical or High urgency)
        const isUrgent = event.urgency === "Critical" || event.urgency === "High"
        // Check if the event is pending
        const isPending = event.status === "Pending"
        
        // Notification for new pending assignments
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

        // Notification for completed events
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
        
        // Notification for cancelled events
        if (event.status === "Cancelled") {
          return (
            <Alert key={event.id} variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Event Cancelled</AlertTitle>
              <AlertDescription>
                The event "{event.name}" scheduled for {event.date.toLocaleDateString()} has been cancelled.
              </AlertDescription>
            </Alert>
          )
        }
        
        // Notification for "No Show" events (volunteer didn't attend)
        if (event.status === "No Show") {
          return (
            <Alert key={event.id} variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Missed Event</AlertTitle>
              <AlertDescription>
                You were marked as "No Show" for: {event.name}<br />
                Date: {event.date.toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )
        }

        // Skip rendering for events that don't match any of the above statuses
        return null
      })}
      
      {/* Event Reminders - Show for any upcoming events within the next two days */}
      {upcomingEvents.map((event) => (
        <Alert key={`reminder-${event.id}`} variant="default">
          <Calendar className="h-4 w-4" />
          <AlertTitle>Upcoming Event Reminder</AlertTitle>
          <AlertDescription>
            Don't forget your upcoming event: {event.name}<br />
            Date: {event.date.toLocaleDateString()}<br />
            Location: {event.location}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Bell, Calendar, Info, Loader2, BadgeAlert } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { VolunteerEvent, getEvents } from "@/lib/temporary_values"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

export function NotificationBell() {
  const [events, setEvents] = useState<VolunteerEvent[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<VolunteerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  // Calculate the total number of notifications
  const notificationCount = events.length + upcomingEvents.length

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events from the API or local function
        const fetchedEvents = await getEvents()
        console.log("Fetched events:", fetchedEvents)
        
        if (!fetchedEvents || fetchedEvents.length === 0) {
          console.log("No events were returned from getEvents()")
          setLoading(false)
          return
        }
        
        // Process events for notifications (any status except "Completed" that needs attention)
        const notificationEvents = fetchedEvents.filter(event => {
          // Make sure event dates are handled correctly
          const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
          
          // Include events with these statuses
          const hasNotificationStatus = ["Pending", "Cancelled", "No Show"].includes(event.status)
          console.log(`Event ${event.id}: ${event.name}, status=${event.status}, hasNotificationStatus=${hasNotificationStatus}`)
          
          return hasNotificationStatus
        })
        
        console.log("Notification events:", notificationEvents)
        setEvents(notificationEvents)
        
        // Filter for upcoming events (within the next 2 days)
        const now = new Date()
        const twoDaysFromNow = new Date(now)
        twoDaysFromNow.setDate(now.getDate() + 2)
        console.log("Date range:", now, "to", twoDaysFromNow)
        
        const upcoming = fetchedEvents.filter(event => {
          // Ensure event.date is a Date object
          const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
          
          // Check if the event is within the date range and has valid status/volunteer
          const isInRange = eventDate > now && eventDate < twoDaysFromNow
          const isPending = event.status === "Pending"
          const hasVolunteer = !!event.volunteer
          
          console.log(`Upcoming check - Event: ${event.name}, Date: ${eventDate}, isPending: ${isPending}, hasVolunteer: ${hasVolunteer}, isInRange: ${isInRange}`)
          
          return isPending && hasVolunteer && isInRange
        })
        
        console.log("Upcoming events:", upcoming)
        setUpcomingEvents(upcoming)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to fetch events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 rounded-full bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto p-0">
        <div className="p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        <div className="p-2">
          <NotificationCenter 
            events={events} 
            upcomingEvents={upcomingEvents} 
            loading={loading} 
            error={error} 
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationCenterProps {
  events: VolunteerEvent[]
  upcomingEvents: VolunteerEvent[]
  loading: boolean
  error: string | null
}

export function NotificationCenter({
  events = [],
  upcomingEvents = [],
  loading = false,
  error = null
}: NotificationCenterProps) {
  // Display a loading spinner while events are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Display error message if there was a problem fetching events
  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <BadgeAlert className="mx-auto h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  // Display a message if there are no events to show
  if (events.length === 0 && upcomingEvents.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <BadgeAlert className="mx-auto h-8 w-8 mb-2" />
        <p>No new notifications</p>
        <p className="text-xs mt-1">This could be because there are no events assigned to you, or all events have been completed.</p>
      </div>
    )
  }

  // Render the list of events
  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2">
      {events.map((event) => {
        // Check if the event is urgent
        const isUrgent = event.urgency === "Critical" || event.urgency === "High"
        // Check if the event is pending
        const isPending = event.status === "Pending"
        
        // Render a notification for pending events
        if (isPending) {
          return (
            <Alert key={event.id} variant={isUrgent ? "destructive" : "default"}>
              <Info className="h-4 w-4" />
              <AlertTitle>New Event</AlertTitle>
              <AlertDescription>
                You have been assigned to: {event.name}<br />
                Date: {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}
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
                Thank you for volunteering at: {event.name}
              </AlertDescription>
            </Alert>
          )
        }
        
        if (event.status === "Cancelled") {
          return (
            <Alert key={event.id} variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Event Cancelled</AlertTitle>
              <AlertDescription>
                The event "{event.name}" scheduled for {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()} has been cancelled.
              </AlertDescription>
            </Alert>
          )
        }
        
        if (event.status === "No Show") {
          return (
            <Alert key={event.id} variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Missed Event</AlertTitle>
              <AlertDescription>
                You were marked as "No Show" for: {event.name}<br />
                Date: {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )
        }

        // Return null for events that don't match any status
        return null
      })}
      
      {/* Event Reminders - Show for any upcoming events */}
      {upcomingEvents.map((event) => (
        <Alert key={`reminder-${event.id}`} variant="default">
          <Calendar className="h-4 w-4" />
          <AlertTitle>Upcoming Event Reminder</AlertTitle>
          <AlertDescription>
            Don't forget your upcoming event: {event.name}<br />
            Date: {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}<br />
            Location: {event.location}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
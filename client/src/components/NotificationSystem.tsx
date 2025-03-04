"use client"
import { Bell, Calendar, Info, Loader2, BadgeAlert } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { VolunteerEvent, getEvents } from "@/lib/temporary_values"
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// Import Badge from the component we just created
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
        const fetchedEvents = await getEvents()
        
        // Update the state with the fetched events
        setEvents(fetchedEvents)
        
        // Filter for upcoming events (within the next 2 days)
        const now = new Date()
        const twoDaysFromNow = new Date(now)
        twoDaysFromNow.setDate(now.getDate() + 2)
        
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

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2">
      {events.map((event) => {
        const isUrgent = event.urgency === "Critical" || event.urgency === "High"
        const isPending = event.status === "Pending"
        
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

        return null
      })}
      
      {/* Event Reminders - Show for any upcoming events */}
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
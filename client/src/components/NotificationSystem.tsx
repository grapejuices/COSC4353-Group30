import { Bell, Calendar, Info, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { VolunteerEvent, getEvents } from "@/lib/temporary_values"

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
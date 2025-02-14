// import { EventSheet } from "@/components/EventForm";
import { EventTable } from "@/components/EventTable";
import { VolunteerEvent } from "@/lib/temporary_values";
import { useState } from "react";

export const VolunteerHistory = () => {
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);

  const handleEditEvent = (event: VolunteerEvent) => {
    setSelectedEvent(event);
  };

  const closeSheet = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      <EventTable onEditEvent={handleEditEvent} />
    </div>
  );
};
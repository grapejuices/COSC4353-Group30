import { EventSheet } from "@/components/EventForm";
import { EventTable, VolunteerEvent } from "@/components/EventTable";
import { useState } from "react";

export const EveManagement = () => {
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
      <EventSheet selectedEvent={selectedEvent} closeSheet={closeSheet} />
    </div>
  );
};
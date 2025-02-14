// import { EventSheet } from "@/components/EventForm";
import { VolunteerTable } from "@/components/VolunteerTable";
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
      <VolunteerTable onEditEvent={handleEditEvent} />
    </div>
  );
};
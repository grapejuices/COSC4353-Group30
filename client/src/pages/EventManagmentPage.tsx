import { EventSheet } from "@/components/EventForm";
import { EventTable } from "@/components/EventTable";
import { VolunteerEvent } from "@/lib/temporary_values";
import { useState } from "react";

export const EveManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditEvent = (event: VolunteerEvent) => {
    setSelectedEvent(event);
  };

  const closeSheet = () => {
    setSelectedEvent(null);
  };

  const handleSave = (savedEvent: VolunteerEvent) => {
    // Force table refresh when an event is saved
    setRefreshKey(prev => prev + 1);

    // Close sheet after save
    closeSheet();
  };

  return (
    <div>
      <EventTable onEditEvent={handleEditEvent} refreshKey={refreshKey} />
      <EventSheet
        selectedEvent={selectedEvent}
        closeSheet={closeSheet}
        onSave={handleSave}
      />
    </div>
  );
};
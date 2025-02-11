import { useState } from "react";
import { EventForm } from "@/components/EventForm";
import { EventTable, VolunteerEvent } from "@/components/EventTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

export const EveManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);

  const handleEditEvent = (event: VolunteerEvent) => {
    setSelectedEvent(event);
  };

  const closeSheet = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-row flex-wrap">
      <EventTable onEditEvent={handleEditEvent} />
      <Sheet open={!!selectedEvent} onOpenChange={closeSheet}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Event</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <SheetDescription>
            Edit the details of the event below.
          </SheetDescription>
            {selectedEvent ? (
              <EventForm VEvent={selectedEvent} closeSheet={closeSheet} />
            ) : (
              <div>Loading...</div>
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { skills } from "@/lib/temporary_values";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { VolunteerEvent } from "./EventTable";
import { SheetFooter } from "./ui/sheet";

interface EventFormProps {
  selectedEvent: VolunteerEvent;
  closeSheet: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ selectedEvent, closeSheet }) => {
  const [event, setEvent] = useState<VolunteerEvent | null>(null);

  useEffect(() => {
    setEvent(selectedEvent);
  }, [selectedEvent]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the event
    closeSheet();
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEvent({ ...event, date });
    }
  };

  const handleAssignVolunteer = () => {
    // Logic to assign a volunteer
    setEvent({ ...event, volunteer: "Assigned Volunteer" });
  };

  const handleSkillsChange = (selectedOptions: any) => {
    const selectedSkills = selectedOptions.map((option: any) => option.value);
    setEvent({ ...event, skills: selectedSkills });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Name</Label>
      <Input value={event.name} onChange={(e) => setEvent({ ...event, name: e.target.value })} />
      <Label>Description</Label>
      <Input value={event.description} onChange={(e) => setEvent({ ...event, description: e.target.value })} />
      <Label>Location</Label>
      <Input value={event.location} onChange={(e) => setEvent({ ...event, location: e.target.value })} />
      <Label>Skills</Label>
      <Select
        isMulti
        value={event.skills.map(skill => ({ value: skill, label: skill }))}
        onChange={handleSkillsChange}
        options={skills.map(skill => ({ value: skill, label: skill }))}
        className="w-full p-2 border rounded-md"
      />
      <Label>Urgency</Label>
      <Select
        value={{ value: event.urgency, label: event.urgency }}
        onChange={(selectedOption: any) => setEvent({ ...event, urgency: selectedOption.value })}
        options={[
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
          { value: "Critical", label: "Critical" },
        ]}
        className="w-full p-2 border rounded-md" />
      <Label>Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !event.date && "text-muted-foreground"
            )}
          >
            {event.date ? (
              format(event.date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={event.date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Label className="mt-4">Volunteer</Label>
      <div>
        {event.volunteer ? (
          <p className="text-sm text-muted-foreground">{event.volunteer}</p>
        ) : (
          <Button variant={"outline"} className="mt-2" onClick={handleAssignVolunteer}>
            Assign Volunteer
          </Button>
        )}
      </div>
      <SheetFooter className="mt-4">
        <Button type="submit">Save</Button>
        <Button variant="outline" onClick={closeSheet}>Cancel</Button>
        <Button variant="outline" onClick={() => setEvent(null)}>Delete</Button>
      </SheetFooter>
    </form>
  );
};

interface EventSheetProps {
  selectedEvent: VolunteerEvent | null;
  closeSheet: () => void;
}

export const EventSheet: React.FC<EventSheetProps> = ({ selectedEvent, closeSheet }) => {
  return (
    <Sheet open={!!selectedEvent} onOpenChange={closeSheet}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <SheetDescription>
          <b>
            For changes to take effect, please save the event.
          </b>
        </SheetDescription>
        {selectedEvent ? (
          <EventForm selectedEvent={selectedEvent} closeSheet={closeSheet} />
        ) : (
          <div>Loading...</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
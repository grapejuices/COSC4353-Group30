import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { SheetFooter } from "./ui/sheet";
import { getAllSkills, getVolunteers, updateEvent } from "@/lib/eventFunctions";

interface EventFormProps {
  selectedEvent: any;
  closeSheet: () => void;
  onSave?: (savedEvent: any) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ selectedEvent, closeSheet, onSave }) => {
  const [event, setEvent] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [bestMatch, setBestMatch] = useState<any | null>(null);
  const [matchAssigned, setMatchAssigned] = useState<boolean>(false);
  const [zipCodeError, setZipCodeError] = useState<string | null>(null);

  // Additional state for the dropdown values
  const [statusValue, setStatusValue] = useState<{ value: string; label: string } | null>(null);
  const [urgencyValue, setUrgencyValue] = useState<{ value: string; label: string } | null>(null);
  const [skillsValue, setSkillsValue] = useState<Array<{ value: string; label: string }>>([]);
  const [volunteerValue, setVolunteerValue] = useState<{ value: string; label: string } | null>(null);

  useEffect(() => {
    // Load volunteers and skills
    const loadVolunteersAndSkills = async () => {
      const [volunteersResult, skillsResult] = await Promise.all([getVolunteers(), getAllSkills()]);
      setVolunteers(volunteersResult);
      setSkillsValue(skillsResult.map(skill => ({ value: skill, label: skill })));
    };
    loadVolunteersAndSkills();

    // Create a deep copy of the selectedEvent to avoid reference issues
    if (selectedEvent) {
      const newEvent = {
        ...selectedEvent,
        skills: [...(selectedEvent.skills || [])],
        volunteer: selectedEvent.volunteer ? { ...selectedEvent.volunteer } : null,
        event_date: new Date(selectedEvent.event_date)
      };
      setEvent(newEvent);

      // Set initial values for dropdowns
      setStatusValue({ value: newEvent.status, label: newEvent.status });
      setUrgencyValue({ value: newEvent.urgency, label: newEvent.urgency });
      setSkillsValue(newEvent.skills.map((skill: any) => ({ value: skill, label: skill })));
      if (newEvent.volunteer) {
        setVolunteerValue({ value: newEvent.volunteer.id, label: newEvent.volunteer.full_name });
      }
    }
  }, [selectedEvent]);

  useEffect(() => {
    // Find best match whenever event data changes that would affect matching
    if (event && volunteers.length > 0 && event.skills.length > 0) {
      const match = findBestVolunteerMatch(event, volunteers);
      setBestMatch(match);

      // If we previously assigned the best match, update with new best match
      if (matchAssigned && match) {
        setEvent((prev: any) => prev ? { ...prev, volunteer: match } : prev);
      }
    }
  }, [event?.skills, event?.event_date, event?.location, volunteers, matchAssigned]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event) return;

    // Validate zip code before submission
    if (!validateZipCode(event.location)) {
      setZipCodeError("Please enter a valid 5-digit zip code");
      return;
    }

    try {
      setSaving(true);
      console.log("Saving event:", event);

      // Create a clean copy of the event to save
      const eventToSave = {
        ...event,
        skills: [...event.skills],
        volunteer: event.volunteer ? { ...event.volunteer } : null,
        event_date: new Date(event.event_date)
      };

      // Save the event using the saveEvent function
      await updateEvent(eventToSave);
      console.log("Event saved successfully:", eventToSave);

      // Call onSave callback if provided
      if (onSave) {
        onSave(eventToSave);
      }

      // Close the sheet
      closeSheet();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event_date: Date | undefined) => {
    if (event_date) {
      setEvent({ ...event, event_date });
    }
  };

  const handleChangeVolunteer = (selectedOption: any) => {
    const selectedVolunteer = volunteers.find(vol => vol.id === selectedOption.value);
    if (selectedVolunteer) {
      setVolunteerValue(selectedOption);
      setEvent({ ...event, volunteer: selectedVolunteer });
    }
  };

  const handleSkillsChange = (selectedOptions: any) => {
    const selectedSkills = selectedOptions.map((option: any) => option.value);
    setSkillsValue(selectedOptions);
    setEvent({ ...event, skills: selectedSkills });
    // Reset match assigned flag when skills change
    setMatchAssigned(false);
  };

  const handleStatusChange = (selectedOption: any) => {
    if (selectedOption) {
      setStatusValue(selectedOption);
      setEvent({ ...event, status: selectedOption.value });
    }
  };

  const handleUrgencyChange = (selectedOption: any) => {
    if (selectedOption) {
      setUrgencyValue(selectedOption);
      setEvent({ ...event, urgency: selectedOption.value });
    }
  };

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 5 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setEvent({ ...event, location: value });

    // Clear error if valid or if empty
    if (validateZipCode(value) || value === "") {
      setZipCodeError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label className="mt-4 text-lg">Name</Label>
      <Input
        value={event.name}
        onChange={(e) => setEvent({ ...event, name: e.target.value })}
      />

      <Label className="mt-4 text-lg">Description</Label>
      <Input
        value={event.description}
        onChange={(e) => setEvent({ ...event, description: e.target.value })}
      />

      <Label className="mt-4 text-lg">Location (Zip Code)</Label>
      <Input
        value={event.location}
        onChange={handleZipCodeChange}
        placeholder="Enter 5-digit zip code"
        maxLength={5}
      />
      {zipCodeError && <p className="text-sm text-red-500">{zipCodeError}</p>}

      <Label className="mt-4 text-lg">Status</Label>
      <Select
        value={statusValue}
        onChange={handleStatusChange}
        options={[
          { value: "Pending", label: "Pending" },
          { value: "Completed", label: "Completed" },
          { value: "Cancelled", label: "Cancelled" },
          { value: "No Show", label: "No Show" },
        ]}
        className="w-full p-2 border rounded-md"
      />

      <Label className="mt-4 text-lg">Skills Needed</Label>
      <Select
        isMulti
        value={skillsValue}
        onChange={handleSkillsChange}
        options={skillsValue}
        className="w-full p-2 border rounded-md"
      />

      <Label className="mt-4 text-lg">Urgency</Label>
      <Select
        value={urgencyValue}
        onChange={handleUrgencyChange}
        options={[
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
          { value: "Critical", label: "Critical" },
        ]}
        className="w-full p-2 border rounded-md"
      />

      <Label className="mt-4 text-lg">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !event.event_date && "text-muted-foreground"
            )}
          >
            {event.event_date ? (
              format(event.event_date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={event.event_date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Label className="mt-4 text-lg">Assigned Volunteer</Label>
      <Select
        value={volunteerValue}
        onChange={handleChangeVolunteer}
        options={volunteers
          .filter(vol => vol.id !== "-1") // Filter out the "No Volunteer Assigned" option
          .map(vol => ({
            value: vol.id,
            label: `${vol.full_name} - Skills: ${vol.skills.join(", ")} - Location: ${vol.zip_code}`
          }))}
        className="w-full p-2 border rounded-md"
      />

      <SheetFooter className="mt-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
      </SheetFooter>
    </form>
  );
};

// Function to find the best volunteer match based on skills, location, and availability
function findBestVolunteerMatch(event: any, volunteers: any[]): any | null {
  if (!volunteers.length) return null;

  // Filter out volunteers who aren't available on the event date
  const availableVolunteers = volunteers.filter(volunteer => {
    return volunteer.availability.some((event_date: string | number | Date) => {
      const availDate = new Date(event_date);
      const eventDate = new Date(event.event_date);
      return availDate.toDateString() === eventDate.toDateString();
    });
  });

  if (!availableVolunteers.length) return null;

  // Score each volunteer based on skills match and location proximity
  const scoredVolunteers = availableVolunteers.map(volunteer => {
    let score = 0;

    // Skills matching (most important factor)
    const matchedSkills = volunteer.skills.filter((skill: any) =>
      event.skills.includes(skill)
    );

    // Calculate percentage of required skills the volunteer has
    const skillScore = event.skills.length ?
      (matchedSkills.length / event.skills.length) * 10 : 0;

    score += skillScore;

    // Location proximity (using zip code)
    // Simple check: if zip codes match, add points
    if (event.location && volunteer.zip_code) {
      // Exact match gets highest score
      if (event.location === volunteer.zip_code) {
        score += 5;
      }
      // First 3 digits match (same general area)
      else if (event.location.substring(0, 3) === volunteer.zip_code.substring(0, 3)) {
        score += 3;
      }
    }

    return { volunteer, score };
  });

  // Sort by score (highest first)
  scoredVolunteers.sort((a, b) => b.score - a.score);

  // Return the highest scoring volunteer
  return scoredVolunteers.length ? scoredVolunteers[0].volunteer : null;
}

interface EventSheetProps {
  selectedEvent: any | null;
  closeSheet: () => void;
  onSave?: (savedEvent: any) => void;
}

export const EventSheet: React.FC<EventSheetProps> = ({ selectedEvent, closeSheet, onSave }) => {
  return (
    <Sheet open={!!selectedEvent} onOpenChange={closeSheet}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{selectedEvent?.id ? 'Edit Event' : 'Create Event'}</SheetTitle>
          <SheetClose />
        </SheetHeader>
        <SheetDescription>
          <b>
            For changes to take effect, please save the event.
          </b>
        </SheetDescription>
        {selectedEvent ? (
          <EventForm selectedEvent={selectedEvent} closeSheet={closeSheet} onSave={onSave} />
        ) : (
          <div>Loading...</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
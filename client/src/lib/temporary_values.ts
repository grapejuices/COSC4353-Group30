// This is temporary data that will be replaced by the data from the database

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------


export class VolunteerEvent {
  status: string
  id: string
  name: string
  description: string
  location: string
  skills: string[]
  urgency: string
  date: Date
  volunteer: Volunteer | null

  constructor(status: string = "", id: string = "", name: string = "", description: string = "", location: string = "", skills: string[] = [], urgency: string = "", date: Date = new Date(), volunteer: Volunteer | null = null) {
      this.status = status;
      this.id = id;
      this.name = name;
      this.description = description;
      this.location = location;
      this.skills = skills;
      this.urgency = urgency;
      this.date = date;
      this.volunteer = volunteer;
  }
}

export class Volunteer {
    id: string
    name: string
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    skills: string[]
    preferences: string[]
    availability: Date[]

    constructor(id: string = "", name: string = "", address1: string = "", address2: string = "", city: string = "", state: string = "", zip: string = "", skills: string[] = [], preferences: string[] = [], availability: Date[] = []) {
        this.id = id;
        this.name = name;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.skills = skills;
        this.preferences = preferences;
        this.availability = availability;
    }
}

export const skills = [
  "Cooking",
  "Cleaning",
  "Driving",
  "Gardening",
  "Handyman",
];

export const urgencyLevels = ["Critical", "High", "Medium", "Low"];

export const status = ["Pending", "Completed", "No Show", "Cancelled"];

export const staticVolunteer = new Volunteer(
  "-1", 
  "No Volunteer Assigned", 
  "123 Main St", 
  "Apt 1", 
  "Anytown", 
  "NY", 
  "12345", 
  ["Cooking", "Cleaning"],
  ["Morning", "Weekends"],
  [new Date()],
);

// ------------------------------------------------------------------------------------------------
// End of Types
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------------------------------------
export const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

export const randomSkills = () => {
  const randomIndex = Math.floor(Math.random() * skills.length);
  return skills.slice(0, randomIndex);
}

export const randomDate = () => {
  const randomDays = Math.floor(Math.random() * 10);
  return new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
}

export function randomZipCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Create random volunteer
function createRandomVolunteer(): Volunteer {

  if (Math.random() < 0.5) {
    return staticVolunteer;
  }
  
  const randomAvailability = () => {
    const randomDays = Math.floor(Math.random() * 10);
    const randomDate = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
    return [randomDate];
  }
  
  var rInt = randomInt(100);
  
  return {
    id: rInt.toString(),
    name: `Volunteer ${rInt}`,
    address1: `Address 1 ${rInt}`,
    address2: `Address 2 ${rInt}`,
    city: `City ${rInt}`,
    state: `State ${rInt}`,
    zip: `Zip ${rInt}`,
    skills: randomSkills(),
    preferences: [],
    availability: randomAvailability(),
  };
}

// Create random event
function createRandomEvent(id: string, volunteers: Volunteer[]): VolunteerEvent {
  
  const randomUrgency = () => {
    const randomIndex = Math.floor(Math.random() * urgencyLevels.length);
    return urgencyLevels[randomIndex];
  }
  
  const randomStatus = () => {
    const randomIndex = Math.floor(Math.random() * status.length);
    return status[randomIndex];
  }

  // 30% chance of having no volunteer assigned
  const volun = Math.random() < 0.3 ? null : volunteers[randomInt(volunteers.length)];

  return {
    status: randomStatus(),
    id: id,
    name: `Event ${id}`,
    description: `Description for event ${id}`,
    location: randomZipCode(), // Generate a 5-digit zip code
    skills: randomSkills(),
    urgency: randomUrgency(),
    date: randomDate(),
    volunteer: volun,
  };
}

// ------------------------------------------------------------------------------------------------
// End of Helper functions
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// Temporary data
// ------------------------------------------------------------------------------------------------

// Create random data
const randomVolunteers: Volunteer[] = Array.from({ length: 10 }, createRandomVolunteer);
const randomEvents: VolunteerEvent[] = Array.from({ length: 10 }, (_, i) => createRandomEvent(i.toString(), randomVolunteers));

// Get all volunteers
export async function getVolunteers(): Promise<Volunteer[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomVolunteers);
    }, 1000);
  });
}

// Get volunteer by id
export async function getVolunteer(id: string): Promise<Volunteer> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomVolunteers.find(volunteer => volunteer.id === id) || new Volunteer());
    }, 1000);
  });
}

// Get all events
export async function getEvents(): Promise<VolunteerEvent[]> {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomEvents);
    }, 1000);
  });
}

// Get number of events
export function getEventsLength(): number {
  return randomEvents.length;
}

// Fetch event by id
export async function getEvent(id: string): Promise<VolunteerEvent> {
  const event = randomEvents.find(event => event.id === id);
  if (event) {
    return new VolunteerEvent(
      event.status,
      event.id,
      event.name,
      event.description,
      event.location,
      event.skills,
      event.urgency,
      event.date,
      event.volunteer
    );
  }
  return new VolunteerEvent();
}

// Save event
export async function saveEvent(event: VolunteerEvent): Promise<VolunteerEvent> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving event in mock DB:", event);
      
      // Make a proper deep clone to avoid reference issues
      const eventToSave = {
        ...event,
        skills: [...event.skills],
        volunteer: event.volunteer ? { ...event.volunteer } : null,
        date: new Date(event.date)
      };
      
      const index = randomEvents.findIndex(e => e.id === eventToSave.id);
      if (index !== -1) {
        console.log(`Updating existing event at index ${index}`);
        randomEvents[index] = eventToSave;
      } else {
        console.log(`Adding new event with id ${eventToSave.id}`);
        randomEvents.push(eventToSave);
      }
      
      console.log("Current events after save:", randomEvents);
      resolve(eventToSave);
    }, 1000);
  });
}

// Create new event
export async function createEvent(): Promise<VolunteerEvent> {
  const newEvent = new VolunteerEvent(
    'Pending',
    (randomEvents.length + 1).toString(),
    'New Event',
    'New Description',
    'New Location',
    [],
    'Medium',
    new Date(),
    null
  );
  randomEvents.push(newEvent);
  return newEvent;
}

// Delete event
export async function deleteEvent(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = randomEvents.findIndex(e => e.id === id);
      if (index !== -1) {
        randomEvents.splice(index, 1);
      }
      resolve();
    }, 500);
  });
}

// ------------------------------------------------------------------------------------------------
// End of Temporary data
// ------------------------------------------------------------------------------------------------

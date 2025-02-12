// This is temporary data that will be replaced by the data from the database

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------

export type VolunteerEvent = {
    status: string
    id: string
    name: string
    description: string
    location: string
    skills: string[]
    urgency: string
    date: Date
    volunteer: Volunteer
}

export type Volunteer = {
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

export const staticVolunteer = {
  id: "-1",
  name: "No Volunteer Assigned",
  address1: "123 Main St",
  address2: "Apt 1",
  city: "Anytown",
  state: "NY",
  zip: "12345",
  skills: ["Cooking", "Cleaning"],
  preferences: ["Morning", "Weekends"],
  availability: [new Date()],
};

// ------------------------------------------------------------------------------------------------
// End of Types
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------------------------------------
const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

const randomSkills = () => {
  const randomIndex = Math.floor(Math.random() * skills.length);
  return skills.slice(0, randomIndex);
}

const randomDate = () => {
  const randomDays = Math.floor(Math.random() * 10);
  return new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
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
function createRandomEvent(volunteers: Volunteer[]): VolunteerEvent {
  
  const randomUrgency = () => {
    const randomIndex = Math.floor(Math.random() * urgencyLevels.length);
    return urgencyLevels[randomIndex];
  }
  
  const randomStatus = () => {
    const randomIndex = Math.floor(Math.random() * status.length);
    return status[randomIndex];
  }

  const volun = volunteers[randomInt(volunteers.length)];
  var rInt = randomInt(100);

  return {
    status: randomStatus(),
    id: rInt.toString(),
    name: `Event ${rInt}`,
    description: `Description for event ${rInt}`,
    location: `Location ${randomInt(100)}`,
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
const randomVolunteers = Array.from({ length: 10 }, createRandomVolunteer);
const randomEvents = Array.from({ length: 10 }, () => createRandomEvent(randomVolunteers));

export async function getVolunteers(): Promise<Volunteer[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomVolunteers);
    }, 1000);
  });
}

// Fetch data from database
export async function getEvents(): Promise<VolunteerEvent[]> {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomEvents);
    }, 1000);
  });
}

// ------------------------------------------------------------------------------------------------
// End of Temporary data
// ------------------------------------------------------------------------------------------------

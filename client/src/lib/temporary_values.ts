// This is temporary data that will be replaced by the data from the database
import { VolunteerEvent } from "@/components/EventTable";

export const skills = [
  "Cooking",
  "Cleaning",
  "Driving",
  "Gardening",
  "Handyman",
];

export const urgency = ["Urgent", "High", "Medium", "Low"];

export const status = ["Pending", "Completed", "No Show", "Cancelled"];

const randomSkills = () => {
  const randomIndex = Math.floor(Math.random() * skills.length);
  return skills.slice(0, randomIndex);
}

const randomUrgency = () => {
  const randomIndex = Math.floor(Math.random() * urgency.length);
  return urgency[randomIndex];
}

const randomStatus = () => {
  const randomIndex = Math.floor(Math.random() * status.length);
  return status[randomIndex];
}

const randomDate = () => {
  const randomDays = Math.floor(Math.random() * 10);
  return new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
}

const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

function createRandomData(): VolunteerEvent {
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
    volunteer: `Volunteer ${randomInt(100)}`,
  };
}


// Fetch data from database
export async function getData(): Promise<VolunteerEvent[]> {
    
  const data = Array.from({ length: 10 }, createRandomData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
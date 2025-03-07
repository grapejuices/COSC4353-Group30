import { Volunteer, VolunteerEvent, getVolunteers, getVolunteer, getEvents, getEvent, getEventsLength, saveEvent, createEvent, deleteEvent } from '../lib/temporary_values';
import { randomInt, randomSkills, randomDate, randomZipCode } from '../lib/temporary_values';

// Test class instantiation
describe('Volunteer class', () => {
  it('should create a Volunteer instance with default values', () => {
    const volunteer = new Volunteer();
    expect(volunteer.id).toBe('');
    expect(volunteer.name).toBe('');
    expect(volunteer.address1).toBe('');
    expect(volunteer.address2).toBe('');
    expect(volunteer.city).toBe('');
    expect(volunteer.state).toBe('');
    expect(volunteer.zip).toBe('');
    expect(volunteer.skills).toEqual([]);
    expect(volunteer.preferences).toEqual([]);
    expect(volunteer.availability).toEqual([]);
  });

  it('should create a Volunteer instance with custom values', () => {
    const volunteer = new Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
    expect(volunteer.id).toBe('1');
    expect(volunteer.name).toBe('John Doe');
    expect(volunteer.address1).toBe('123 Main St');
    expect(volunteer.address2).toBe('Apt 1');
    expect(volunteer.city).toBe('Anytown');
    expect(volunteer.state).toBe('NY');
    expect(volunteer.zip).toBe('12345');
    expect(volunteer.skills).toEqual(['Cooking']);
    expect(volunteer.preferences).toEqual(['Morning']);
    expect(volunteer.availability.length).toBe(1);
  });
});

describe('VolunteerEvent class', () => {
  it('should create a VolunteerEvent instance with default values', () => {
    const event = new VolunteerEvent();
    expect(event.status).toBe('');
    expect(event.id).toBe('');
    expect(event.name).toBe('');
    expect(event.description).toBe('');
    expect(event.location).toBe('');
    expect(event.skills).toEqual([]);
    expect(event.urgency).toBe('');
    expect(event.date).toBeInstanceOf(Date);
    expect(event.volunteer).toBeNull();
  });

  it('should create a VolunteerEvent instance with custom values', () => {
    const volunteer = new Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
    const event = new VolunteerEvent('Pending', '1', 'Event 1', 'Description', 'Location', ['Cooking'], 'High', new Date(), volunteer);
    expect(event.status).toBe('Pending');
    expect(event.id).toBe('1');
    expect(event.name).toBe('Event 1');
    expect(event.description).toBe('Description');
    expect(event.location).toBe('Location');
    expect(event.skills).toEqual(['Cooking']);
    expect(event.urgency).toBe('High');
    expect(event.date).toBeInstanceOf(Date);
    expect(event.volunteer).toEqual(volunteer);
  });
});

// Test helper functions
describe('Helper functions', () => {
  it('should generate a random integer', () => {
    const max = 10;
    const randomNumber = randomInt(max);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThan(max);
  });

  it('should generate random skills', () => {
    const skills = randomSkills();
    expect(skills).toBeInstanceOf(Array);
  });

  it('should generate a random date', () => {
    const date = randomDate();
    expect(date).toBeInstanceOf(Date);
  });

  it('should generate a random zip code', () => {
    const zipCode = randomZipCode();
    expect(zipCode).toMatch(/^\d{5}$/);
  });
});

// Test data retrieval functions
describe('Data retrieval functions', () => {
  it('should get all volunteers', async () => {
    const volunteers = await getVolunteers();
    expect(volunteers.length).toBeGreaterThan(0);
  });

  it('should get a volunteer by id', async () => {
    const volunteer = await getVolunteer('1');
    expect(volunteer).toBeInstanceOf(Volunteer);
  });

  it('should get all events', async () => {
    const events = await getEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it('should get an event by id', async () => {
    const event = await getEvent('1');
    expect(event).toBeInstanceOf(VolunteerEvent);
  });

  it('should get the number of events', () => {
    const length = getEventsLength();
    expect(length).toBeGreaterThan(0);
  });
});

// Test data manipulation functions
describe('Data manipulation functions', () => {
  it('should save an event', async () => {
    const volunteer = new Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
    const event = new VolunteerEvent('Pending', '1', 'Event 1', 'Description', 'Location', ['Cooking'], 'High', new Date(), volunteer);
    const savedEvent = await saveEvent(event);
    expect(savedEvent).toEqual(event);
  });

  it('should create a new event', async () => {
    const newEvent = await createEvent();
    expect(newEvent).toBeInstanceOf(VolunteerEvent);
    expect(newEvent.id).toBeDefined();
  });

  it('should delete an event', async () => {
    await deleteEvent('1');
    const event = await getEvent('1');
    expect(event.id).toBe('');
  });
});
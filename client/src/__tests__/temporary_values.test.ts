import * as temporary_values from '../lib/temporary_values';
import { randomInt, randomSkills, randomDate, randomZipCode } from '../lib/temporary_values';

// Test class instantiation
describe('Volunteer class', () => {
  it('should create a Volunteer instance with default values', () => {
    const volunteer = new temporary_values.Volunteer();
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
    const volunteer = new temporary_values.Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
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
    const event = new temporary_values.VolunteerEvent();
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
    const volunteer = new temporary_values.Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
    const event = new temporary_values.VolunteerEvent('Pending', '1', 'Event 1', 'Description', 'Location', ['Cooking'], 'High', new Date(), volunteer);
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
    const volunteers = await temporary_values.getVolunteers();
    expect(volunteers.length).toBeGreaterThan(0);
  });

  it('should get a volunteer by id', async () => {
    const volunteer = await temporary_values.getVolunteer('1');
    expect(volunteer).toBeInstanceOf(temporary_values.Volunteer);
  });

  it('should get all events', async () => {
    const events = await temporary_values.getEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it('should get an event by id', async () => {
    const event = await temporary_values.getEvent('1');
    expect(event).toBeInstanceOf(temporary_values.VolunteerEvent);
  });

  it('should get the number of events', () => {
    const length = temporary_values.getEventsLength();
    expect(length).toBeGreaterThan(0);
  });
});

// Test data manipulation functions
describe('Data manipulation functions', () => {
  it('should save an event', async () => {
    const volunteer = new temporary_values.Volunteer('1', 'John Doe', '123 Main St', 'Apt 1', 'Anytown', 'NY', '12345', ['Cooking'], ['Morning'], [new Date()]);
    const event = new temporary_values.VolunteerEvent('Pending', '1', 'Event 1', 'Description', 'Location', ['Cooking'], 'High', new Date(), volunteer);
    const savedEvent = await temporary_values.saveEvent(event);
    expect(savedEvent).toEqual(event);
  });

  it('should create a new event', async () => {
    const newEvent = await temporary_values.createEvent();
    expect(newEvent).toBeInstanceOf(temporary_values.VolunteerEvent);
    expect(newEvent.id).toBeDefined();
  });

  it('should delete an event', async () => {
    await temporary_values.deleteEvent('1');
    const event = await temporary_values.getEvent('1');
    expect(event.id).toBe('');
  });
});
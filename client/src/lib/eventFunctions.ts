import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

// =================================================================================================
// Event Functions
// =================================================================================================

export const urgencyLevels = [
    { value: 0, label: "Low" },
    { value: 1, label: "Medium" },
    { value: 2, label: "High" },
    { value: 3, label: "Critical" },
];

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getEvents = async (): Promise<any[]> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/events/`, getAuthHeaders());
        var events: any[] = response.data;
        console.log(events);

        // for (const element of events) {
        //     element.urgency = urgencyLevels[Number(element.urgency)].label;
        // }
        

        return events;
    } catch (error) {
        console.error("Error getting events:", error);
        return [];
    }
};

export const getEvent = async (id: string): Promise<any> => {
    // try {
    //     const response = await axios.get(`${BACKEND_URL}/events/${id}/`, getAuthHeaders());
    //     var event: any = response.data;

    //     event.volunteer = await getVolunteer(event.id);

    //     return event;
    // } catch (error) {
    //     console.error("Error getting event:", error);
    //     return {};
    // }
};

export const getSkillsFromEvent = async (id: string): Promise<string[]> => {
    // try {
    //     const response = await axios.get(`${BACKEND_URL}/event-skills/${id}/`, getAuthHeaders());
    //     return response.data;
    // } catch (error) {
    //     console.error("Error getting skills from event:", error);
    //     return [];
    // }
    return ["null"]
};

export const createEvent = async (event: any): Promise<any> => {
    try {
        const response = await axios.post(`${BACKEND_URL}/events/`, event, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error);
        return {};
    }
};

export const updateEvent = async (event: any): Promise<void> => {
    // try {
    //     await axios.put(`${BACKEND_URL}/events/${event.id}/`, event, getAuthHeaders());
    // } catch (error) {
    //     console.error("Error updating event:", error);
    // }
};

export const deleteEvent = async (id: string): Promise<void> => {
    // try {
    //     await axios.delete(`${BACKEND_URL}/events/${id}/`, getAuthHeaders());
    // } catch (error) {
    //     console.error("Error deleting event:", error);
    // }
};

export const getAllSkills = async (): Promise<string[]> => {
    // try {
    //     const response = await axios.get(`${BACKEND_URL}/skills/`, getAuthHeaders());
    //     return response.data;
    // } catch (error) {
    //     console.error("Error getting all skills:", error);
    //     return [];
    // }
    return ["null"]
};

// =================================================================================================
// Volunteer Functions
// =================================================================================================

export const getVolunteers = async (): Promise<any[]> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/users/`, getAuthHeaders());
        var volunteers: any[] = response.data;

        for (const element of volunteers) {
            element.skills = await getSkillsFromVolunteer(element.id);
        }

        return volunteers;
    } catch (error) {
        console.error("Error getting volunteers:", error);
        return [];
    }
};

export const getVolunteer = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/user/${id}/`, getAuthHeaders());
        var volunteer: any = response.data;

        volunteer.skills = await getSkillsFromVolunteer(volunteer.id);

        return volunteer;
    } catch (error) {
        console.error("Error getting volunteer:", error);
        return {};
    }
};

export const getSkillsFromVolunteer = async (id: string): Promise<string[]> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/user/${id}/`, getAuthHeaders());


        return response.data.skills;
    } catch (error) {
        console.error("Error getting skills from volunteer:", error);
        return [];
    }
};
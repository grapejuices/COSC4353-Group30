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
        return events;
    } catch (error) {
        console.error("Error getting events:", error);
        return [];
    }
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

        volunteer.skills = await getSkillsFromVolunteer(volunteer.user_id);

        return volunteer;
    } catch (error) {
        console.error("Error getting volunteer:", error);
        return {};
    }
};

export const getSkillsFromVolunteer = async (id: string): Promise<string[]> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/users/${id}/`, getAuthHeaders());
        return response.data.skills;
    } catch (error) {
        console.error("Error getting skills from volunteer:", error);
        return [];
    }
};

export const getCSVReportEvent = async (): Promise<any> => {
    try{
        const response = await axios.get(`${BACKEND_URL}/report/events/csv/`, getAuthHeaders());
        return response.data;
    }
    catch (error) {
        console.error("Error getting CSV report:", error);
        return {};
    }
};

export const getPDFReportEvent = async (): Promise<any> => {
    try{
        const response = await axios.get(`${BACKEND_URL}/report/events/pdf/`, getAuthHeaders());
        return response.data;
    }
    catch (error) {
        console.error("Error getting PDF report:", error);
        return {};
    }
};

export const getCSVReportVolunteer = async (): Promise<any> => {
    try{
        const response = await axios.get(`${BACKEND_URL}/report/volunteer-history/csv/`, getAuthHeaders());
        return response.data;
    }
    catch (error) {
        console.error("Error getting CSV report:", error);
        return {};
    }
};

export const getPDFReportVolunteer = async (): Promise<any> => {
    try{
        const response = await axios.get(`${BACKEND_URL}/report/volunteer-history/pdf/`, getAuthHeaders());
        return response.data;
    }
    catch (error) {
        console.error("Error getting PDF report:", error);
        return {};
    }
};
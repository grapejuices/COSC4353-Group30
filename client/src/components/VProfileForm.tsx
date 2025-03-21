import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import Multiselect from 'multiselect-react-dropdown';

export const VProfileForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip_code: "",
    preferences: "",
  });

  const [availability, setAvailability] = useState<Date[]>([]);

  const states = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "AS", label: "American Samoa" },
    { value: "DC", label: "District of Columbia" },
    { value: "FM", label: "Federated States of Micronesia" },
    { value: "GU", label: "Guam" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "PW", label: "Palau" },
    { value: "PR", label: "Puerto Rico" },
    { value: "VI", label: "Virgin Islands" },
  ];

  const skillOptions = [
    "Teaching",
    "Mentoring",
    "Event Planning",
    "Fundraising",
    "Marketing",
    "Web Development",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value });
  };

  const [skills, setSkills] = useState<string[]>([]);

  const handleSkillsChange = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAvailabilityChange = (date: Date | null) => {
    if (date && !availability.some((d) => d.toDateString() === date.toDateString())) {
      setAvailability([...availability, date]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken  = localStorage.getItem("access_token");

    try {
      console.log(formData);
      const profileResponse = await axios.put(
        `${BACKEND_URL}/profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (availability.length > 0) {
        const parsedAvail = availability.map((date) => ({ date: date.toISOString().split("T")[0] }));
        console.log(parsedAvail);
        await axios.post(
          `${BACKEND_URL}/availabilities/`,
          availability.map((date) => ({ date: date.toISOString().split("T")[0] })),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (skills.length > 0) {
        await axios.post(
          `${BACKEND_URL}/skills/`,
          skills.map((skill) => ({ name: skill })),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Profile updated:", profileResponse.data);
      // console.log("Availability updated:", availabilityResponse.data);
      // console.log("Skills updated:", skillsResponse.data);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  useEffect(() => {
    const accessToken  = localStorage.getItem("access_token");
    axios.get(`${BACKEND_URL}/profile/`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      setFormData({
        full_name: response.data.full_name || "",
        address1: response.data.address1 || "",
        address2: response.data.address2 || "",
        city: response.data.city || "",
        state: response.data.state || "",
        zip_code: response.data.zip_code || "",
        preferences: response.data.preferences || "",
      });
    })
    .catch((error) => {
      console.error("Profile fetch failed:", error);
    })

    axios.get(`${BACKEND_URL}/availabilities/`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      const parsedDates = response.data.map((item: { date: string }) => new Date(item.date));

      setAvailability(parsedDates);
    })
    .catch((error) => {
      console.error("Availabilities fetch failed:", error);
    })

    axios.get(`${BACKEND_URL}/skills/`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      const parsedSkills = response.data.map((item: { name: string }) => item.name);

      setSkills(parsedSkills);
    })
    .catch((error) => {
      console.error("Skills fetch failed:", error);
    })


  }, []);

  return (
    <Card className="bg-black text-white border border-gray-700 w-full max-w-lg shadow-lg mt-10">
      <CardHeader>
        <CardTitle className="text-center font-bold text-xl">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name:</Label>
            <Input
              name="full_name"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.full_name}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>

          <div>
            <Label>Address 1:</Label>
            <Input
              name="address1"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.address1}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div>
            <Label>Address 2 (Optional):</Label>
            <Input
              name="address2"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.address2}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div>
            <Label>City:</Label>
            <Input
              name="city"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.city}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div>
            <Label>State:</Label>
            <Select onValueChange={handleStateChange}>
              <SelectTrigger className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Zip Code:</Label>
            <Input
              name="zip_code"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.zip_code}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={9}
            />
          </div>

          <div>
            <Label>Skills:</Label>
            <Multiselect
              options={skillOptions.map((skill) => ({ name: skill}))}
              selectedValues={skills.map((skill) => ({ name: skill}))}
              onSelect={(selectedList) => setSkills(selectedList.map((item: { name: string; }) => item.name))}
              onRemove={(selectedList) => setSkills(selectedList.map((item: { name: string; }) => item.name))}
              displayValue="name"
              className="bg-gray-800 text-black border-gray-600 focus:ring-gray-500 mt-1"
            />
          </div>

          <div>
            <Label>Preferences (Optional):</Label>
            <Textarea
              name="preferences"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.preferences}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Availability (Select multiple dates):</Label>
            <br />
            <DatePicker
              selected={null}
              onChange={(date) => handleAvailabilityChange(date)}
              placeholderText="Select available dates"
              highlightDates={availability}
              className="w-full p-2 border rounded-md bg-gray-800 text-white focus:ring-gray-500 mt-2"
            />
            
            <div className="mt-3 flex flex-wrap gap-2">
              {availability.map((date, index) => (
                <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded">
                  {date.toLocaleDateString()}
                  <button
                    className="ml-2 text-red-400"
                    onClick={() => setAvailability(availability.filter((_,i) => i !== index))}
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300 rounded">
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
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

export const VProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    preferences: "",
  });

  const [availability, setAvailability] = useState<Date[]>([]);

  const states = [
    { value: "TX", label: "Texas" },
    { value: "CA", label: "California" },
    { value: "NY", label: "New York" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile Data:", formData);
    alert("Profile updated successfully!");
  };

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
              name="fullName"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.fullName}
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
              name="zipCode"
              className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1"
              value={formData.zipCode}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={9}
            />
          </div>

          <div>
            <Label>Skills:</Label>
            <Select>
              <SelectTrigger className="bg-gray-800 text-white border-gray-600 focus:ring-gray-500 mt-1">
                <SelectValue placeholder="Select Skills" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions.map((skill) => (
                  <SelectItem key={skill} value={skill} onClick={() => handleSkillsChange(skill)}>
                    <input type="checkbox" checked={skills.includes(skill)} readOnly className="mr-2" />
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="bg-gray-700 text-white px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
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
              className="w-full p-2 border rounded-md bg-gray-800 text-white focus:ring-gray-500 mt-2"
              placeholderText="Select available dates"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {availability.map((date, index) => (
                <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded">
                  {date.toLocaleDateString()}
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

import { Button } from "@/components/ui/button";
import { getEvents, getVolunteers } from "./eventFunctions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

export function ExportToPDF() {
  const handleExport = async () => {
    try {
      const allEvents = await getEvents();
      const allVolunteers = await getVolunteers();

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Event/Volunteer Management System", 14, 10);

      if (allEvents.length > 0) {
        doc.setFontSize(12);
        doc.text("Events", 14, 20);
        autoTable(doc, {
          startY: 25,
          head: [["ID", "Name", "Location", "Date", "Urgency", "Skills"]],
          body: allEvents.map(event => [
            event.id,
            event.event_name,
            event.location,
            new Date(event.event_date).toLocaleString(),
            event.urgency,
            event.required_skills.map((skill: any) => skill.name).join(", ")
          ]),
        });
      } else {
        doc.setFontSize(10);
        doc.text("No events found", 14, 20);
      }

      if (allVolunteers.length > 0) {
        const eventsTableFinalY = doc.lastAutoTable?.finalY || 25;
        const nextY = eventsTableFinalY + 10;
        doc.text("Volunteers", 14, nextY);
        autoTable(doc, {
          startY: nextY + 5,
          head: [["ID", "Name", "Address", "City", "State", "Zip", "Preferences", "Skills"]],
          body: allVolunteers.map(volunteer => [
            volunteer.id,
            volunteer.full_name,
            `${volunteer.address1 || ""} ${volunteer.address2 || ""}`.trim(),
            volunteer.city,
            volunteer.state,
            volunteer.zip_code,
            volunteer.preferences,
            volunteer.skills,
          ]),
        });
      } else {
        const eventsTableFinalY = doc.lastAutoTable?.finalY || 25;
        const nextY = eventsTableFinalY + 10;
        doc.setFontSize(10);
        doc.text("No volunteers found", 14, nextY);
      }

      doc.save("Export.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  return (
    <Button onClick={handleExport} style={{ margin: "10px", padding: "5px" }}>
      Export to PDF
    </Button>
  );
}

export function ExportToCSV() {
  const handleExport = async () => {
    try {
      const allEvents = await getEvents();
      const allVolunteers = await getVolunteers();

      const eventsCSV = convertToCSV(allEvents, ["id", "event_name", "location", "event_date", "urgency", "required_skills"]);
      const volunteersCSV = convertToCSV(allVolunteers, ["user_id", "full_name", "address1", "address2", "city", "state", "zip_code", "preferences", "skills"]);

      const blob = new Blob([eventsCSV + "\n\n" + volunteersCSV], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    }
  };

  return (
    <Button onClick={handleExport} style={{ margin: "10px", padding: "5px" }}>
      Export to CSV
    </Button>
  );
}

function convertToCSV(data: any[], headers: string[]): string {
  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header] || ""; 

      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          value = value.map((item: any) => item.name || "").join(", ");
        } else {
          value = value.join(", ");
        }
      }

      return `"${value}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

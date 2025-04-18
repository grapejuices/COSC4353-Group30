import { Button } from "@/components/ui/button";
import { getCSVReportEvent, getPDFReportEvent, getCSVReportVolunteer, getPDFReportVolunteer } from "./eventFunctions";

export function ExportToPDF({ event }: { event: boolean }) {
  const handleExport = async () => {
    try {
      var exportedPDF;
      if (event) {
        exportedPDF = await getPDFReportEvent();
      } else {
        exportedPDF = await getPDFReportVolunteer();
      }

      const blob = new Blob([exportedPDF], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event ? 'ExportEvent.pdf' : 'ExportVolunteer.pdf'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  return (
    <Button onClick={handleExport} style={{ margin: "10px", padding: "5px" }}>
      Export {event ? 'Events' : 'Volunteers'} to PDF
    </Button>
  );
}

export function ExportToCSV({ event }: { event: boolean }) {
  const handleExport = async () => {
    try {
      var exportedCSV;
      if (event) {
        exportedCSV = await getCSVReportEvent();
      } else {
        exportedCSV = await getCSVReportVolunteer();
      }

      const blob = new Blob([exportedCSV], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event ? 'ExportEvent.csv' : 'ExportVolunteer.csv'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    }
  };

  return (
    <Button onClick={handleExport} style={{ margin: "10px", padding: "5px" }}>
      Export {event ? 'Events' : 'Volunteers'} to CSV
    </Button>
  );
}
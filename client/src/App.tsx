import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
// import { EveManagement } from "./pages/EventManagmentPage";
// import { VolunteerHistory } from "./pages/VolunteerHistoryTMP";
import { VProfilePage } from "./pages/VProfilePage";
import { EventsPage } from "./pages/EventsPage";
// import { VolunteerHistoryTMP } from "./pages/VolunteerHistoryTMP";
import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import { BACKEND_URL } from "./lib/config";
import { VolunteerHistoryPage } from "./pages/VolunteerHistoryPage";
import { ExportToCSV, ExportToPDF } from "./lib/exportTo";

function App() {
  console.log(`BACKEND_URL: ${BACKEND_URL}`);
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/vdashboard"
            element={
              <ProtectedRoute allowedRoles={["volunteer"]}>
                <div style={{ display: 'flex', height: '100vh', padding: '20px' }}>
                  <div style={{ flex: 1, overflow: 'auto', paddingRight: '10px' }}>
                    <VolunteerHistoryPage />
                  </div>
                  <div style={{ flex: 1, overflow: 'auto', paddingLeft: '10px' }}>
                    <VProfilePage />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', padding: '20px' }}>
                  <div style={{ width: '1px', backgroundColor: 'black', height: '100%', margin: '0 20px' }}></div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ExportToPDF event={true} />
                    <ExportToPDF event={false} />
                  </div>

                  <div style={{ width: '1px', backgroundColor: 'black', height: '100%', margin: '0 20px' }}></div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ExportToCSV event={true} />
                    <ExportToCSV event={false} />
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'black', height: '100%', margin: '0 20px' }}></div>

                </div>
                <EventsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
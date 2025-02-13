import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { EveManagement } from "./pages/EventManagmentPage";
import { VProfilePage } from "./pages/VProfilePage";
import { VolunteerHistoryTMP } from "./pages/VolunteerHistoryTMP";
import { AuthProvider } from "./AuthProvider"; 
import ProtectedRoute from "./ProtectedRoute"; 

function App() {
  return (
    <Router> 
      {/* <AuthProvider>  */}
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/event-management"
            element={
              //<ProtectedRoute allowedRoles="admin">
                <EveManagement />
              //</ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              //<ProtectedRoute allowedRoles="volunteer">
                <VProfilePage />
              //</ProtectedRoute>
            }
          />
          <Route path="/vdashboard" element={<p>Volunteer Dashboard.</p>} />
          <Route path="/adashboard" element={<p>Admin Dashboard.</p>} />
          <Route path="/Volunteer-History-Temp" element={<p>Volunteer History.</p>} />
          {/* <Route path="/vdashboard" element={<ProtectedRoute allowedRoles="volunteer"><p>Volunteer Dashboard.</p></ProtectedRoute>} /> */}
          {/* <Route path="/adashboard" element={<ProtectedRoute allowedRoles="admin"><p>Admin Dashboard.</p></ProtectedRoute>} /> */}
        </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;

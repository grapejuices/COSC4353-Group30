import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { EveManagement } from './pages/EventManagmentPage';

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LoginPage />}/>
        <Route path='/signup' element={<SignUpPage />}/>
        <Route path='/edashboard' element={<EveManagement />}/>
        <Route path='/profile' element={<p>Complete your volunteer profile.</p>} />
        <Route path='/vdashboard' element={<p>Volunteer Dashboard.</p>} />
        <Route path='/adashboard' element={<p>Admin Dashboard.</p>} />
      </Routes>
    </Router>

    </>
  )
}

export default App

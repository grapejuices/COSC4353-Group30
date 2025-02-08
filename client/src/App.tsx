import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { SignUp } from './pages/SignUp';
import { EveManagement } from './pages/EventMangePage';

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LoginPage />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/eventmanagement' element={<EveManagement />}/>
      </Routes>
    </Router>

    </>
  )
}

export default App

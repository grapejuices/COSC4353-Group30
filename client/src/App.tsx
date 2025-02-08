import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { SignUp } from './pages/SignUp';

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LoginPage />}/>
        <Route path='/signup' element={<SignUp />}/>
      </Routes>
    </Router>

    </>
  )
}

export default App

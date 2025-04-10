// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import PermitList from './components/PermitList'
import PermitForm from './components/PermitForm'
import NavbarComponent from './components/NavbarComponent'
//const API_BASE_URL = 'http://localhost:5000/api/v1'

function App() {
  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/permits" element={<PermitList />} />
          <Route path="/permits/create" element={<PermitForm />} />
          <Route path="/permits/edit/:id" element={<PermitForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

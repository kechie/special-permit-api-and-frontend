// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
//import Register from './components/Register'
import Home from './components/Home'
import PermitList from './components/PermitList'
import PermitForm from './components/PermitForm'
import PrintTop from './components/PrintTop'
import PrintPermit from './components/PrintPermit'
import NavbarComponent from './components/PermitNavbar'
import PrivateRoute from './components/PrivateRoute'

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="alert alert-danger m-3">
          <h4>Error</h4>
          <p>{this.state.error.message}</p>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="container mt-3">
          <NavbarComponent />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/*             
            <Route path="/permits/:id/print-top" element={<PrintTop />} />
            <Route path="/permits/:id/print" element={<PrintPermit />} />
            */}
            {/* Protected Routes */}
            <Route path="/permits" element={<PrivateRoute element={<PermitList />} />} />
            <Route path="/permits/new" element={<PrivateRoute element={<PermitForm />} />} />
            <Route path="/permits/:id/edit" element={<PrivateRoute element={<PermitForm />} />} />
            <Route path="/permits/:id/print-top" element={<PrivateRoute element={<PrintTop />} />} />
            <Route path="/permits/:id/print" element={<PrivateRoute element={<PrintPermit />} />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

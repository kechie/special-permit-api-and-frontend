// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import PermitList from './components/PermitList'
import PermitForm from './components/PermitForm'
import PrintTop from './components/PrintTop'
import PrintPermit from './components/PrintPermit'
import NavbarComponent from './components/NavbarComponent'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/permits" element={<PrivateRoute element={<PermitList />} />} />
          <Route path="/permits/new" element={<PrivateRoute element={<PermitForm />} />} />
          <Route path="/permits/:id/edit" element={<PrivateRoute element={<PermitForm />} />} />
          <Route path="/permits/:id/print-top" element={<PrivateRoute element={<PrintTop />} />} />
          <Route path="/permits/:id/print" element={<PrivateRoute element={<PrintPermit />} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

// // src/App.jsx
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import Login from './components/Login'
// import Register from './components/Register'
// import PermitList from './components/PermitList'
// import PermitForm from './components/PermitForm'
// import NavbarComponent from './components/NavbarComponent'
// import PrivateRoute from './components/PrivateRoute'
// //const API_BASE_URL = 'http://localhost:5000/api/v1'

// function App() {
//   return (
//     <Router>
//       <NavbarComponent />
//       <div className="container mt-3">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />
//           {/* Protected Routes */}
//           {/* <Route path="/register" element={<Register />} /> */}
//           <Route path="/permits" element={<PrivateRoute element={<PermitList />} />} />
//           <Route path="/permits/new" element={<PrivateRoute element={<PermitForm />} />} />
//           <Route path="/permits/:id/edit" element={<PrivateRoute element={<PermitForm />} />} />
//           {/*           <Route path="/permits" element={<PermitList />} />
//           <Route path="/permits/create" element={<PermitForm />} />
//           <Route path="/permits/edit/:id" element={<PermitForm />} />
//            */}
//         </Routes>
//       </div>
//     </Router >
//   )
// }

// export default App

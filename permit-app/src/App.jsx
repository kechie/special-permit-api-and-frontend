import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import PermitList from './components/PermitList';
import PermitForm from './components/PermitForm';
import PrintTop from './components/PrintTop';
import PrintPermit from './components/PrintPermit';
import MonitorComponent from './components/Monitor';
import NavbarComponent from './components/PermitNavbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

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

const routeConfig = [
  // Public routes
  { path: '/', element: <Home />, public: true },
  { path: '/login', element: <Login />, public: true },
  // Admin/Staff routes
  {
    path: '/permits',
    element: <PermitList />,
    roles: ['superadmin', 'admin', 'staff']
  },
  {
    path: '/permits/new',
    element: <PermitForm />,
    roles: ['superadmin', 'admin', 'staff']
  },
  {
    path: '/permits/:id/edit',
    element: <PermitForm />,
    roles: ['superadmin', 'admin', 'staff']
  },
  {
    path: '/permits/:id/print-top',
    element: <PrintTop />,
    roles: ['superadmin', 'admin', 'staff']
  },
  {
    path: '/permits/:id/print',
    element: <PrintPermit />,
    roles: ['superadmin', 'admin', 'staff']
  },
  // Monitor-only route
  {
    path: '/monitor',
    element: <MonitorComponent />,
    roles: ['superadmin', 'monitor']
  }
];

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router basename="/spclpermits/">
          <div className="container mt-3">
            <NavbarComponent />
            <Routes>
              {routeConfig.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.public ? (
                      route.element
                    ) : (
                      <PrivateRoute
                        element={route.element}
                        allowedRoles={route.roles}
                      />
                    )
                  }
                />
              ))}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <Footer />
    </ErrorBoundary>

  );
}

export default App;
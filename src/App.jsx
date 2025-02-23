import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Students from './pages/Students';
import Subjects from './pages/Subjects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected route: Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Child routes di dalam Dashboard */}
          <Route index element={<Home />} />
          <Route path="students" element={<Students />} />
          <Route path="subjects" element={<Subjects />} />
        </Route>

        {/* Redirect root ke /login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

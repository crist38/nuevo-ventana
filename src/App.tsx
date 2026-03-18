import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Editor } from './pages/Editor';
import { Dashboard } from './pages/Dashboard';
import { Termopaneles } from './pages/Termopaneles';
import { Optimizer } from './pages/Optimizer';
import { Admin } from './pages/Admin';
import { Configuracion } from './pages/Configuracion';
import { Users } from './pages/Users';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (sin Navigation) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas (con Navigation) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 overflow-hidden">
                  <Routes>
                    <Route path="/aluminio" element={<Editor />} />
                    <Route path="/cotizador-termopaneles" element={<Termopaneles />} />
                    <Route path="/presupuestos" element={<Dashboard />} />
                    <Route path="/admin/optimizer" element={<Optimizer />} />
                    <Route path="/admin/configuracion" element={<Configuracion />} />
                    <Route path="/admin/usuarios" element={<Users />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

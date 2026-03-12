import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Editor } from './pages/Editor';
import { Dashboard } from './pages/Dashboard';
import { Termopaneles } from './pages/Termopaneles';
import { Optimizer } from './pages/Optimizer';
import { Admin } from './pages/Admin';
import { Navigation } from './components/Navigation';

import { Configuracion } from './pages/Configuracion';

import { Users } from './pages/Users';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/cotizador-termopaneles" element={<Termopaneles />} />
            <Route path="/presupuestos" element={<Dashboard />} />
            <Route path="/admin/optimizer" element={<Optimizer />} />
            <Route path="/admin/configuracion" element={<Configuracion />} />
            <Route path="/admin/usuarios" element={<Users />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ArrowRight,
  Zap,
  Clock,
  Settings,
  Maximize2,
  ThermometerSnowflake,
  ClipboardList,
  LayoutDashboard,
  User,
  LogOut,
} from 'lucide-react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { ADMIN_EMAILS } from '../lib/constants';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email ? ADMIN_EMAILS.includes(u.email) : false);
    });
    return () => unsub();
  }, []);

  const categories = [
    {
      title: 'Sistemas de Aluminio',
      description: 'Elegancia y resistencia minimalista. Líneas 5000, Al-25, Al-42 y más.',
      icon: <Maximize2 className="w-8 h-8" />,
      link: '/aluminio',
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-200 dark:shadow-none',
      features: ['Minimalista', 'Alta Durabilidad', 'Variedad de Colores'],
    },
    {
      title: 'Termopaneles',
      description: 'Configura tus cristales DVH a medida con separadores y palillos.',
      icon: <ThermometerSnowflake className="w-8 h-8" />,
      link: '/cotizador-termopaneles',
      color: 'bg-orange-500',
      shadow: 'shadow-orange-200 dark:shadow-none',
      features: ['Aislación Certificada', 'Palillos Opcionales', 'Control Solar'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#19a8aa]/30">
      {/* Barra de Navegación */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo Cripter" className="w-10 h-10 object-contain" />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user && (
              <button
                onClick={() => navigate('/presupuestos')}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#19a8aa] transition-colors"
              >
                <ClipboardList size={18} />
                <span className="hidden sm:inline">Mis Presupuestos</span>
              </button>
            )}
            {user && (
              isAdmin ? (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 text-sm font-bold text-[#19a8aa] bg-[#19a8aa]/10 px-4 py-2 rounded-full hover:bg-[#19a8aa]/20 transition-all"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Panel Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin/configuracion')}
                  className="flex items-center gap-2 text-sm font-bold text-[#19a8aa] bg-[#19a8aa]/10 px-4 py-2 rounded-full hover:bg-[#19a8aa]/20 transition-all"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Ajustes Precios</span>
                </button>
              )
            )}
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Iniciar Sesión
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                  {user.email?.[0]}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sección Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              Cotizador Digital
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
              Transforma tu espacio con <span className="text-[#19a8aa]">Ventanas</span> de Excelencia.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
              Diseña, personaliza y cotiza tus ventanas de Aluminio en tiempo real. Calidad premium garantizada con tecnología de última generación.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 flex items-center gap-3"
              >
                Empezar a Cotizar
                <ArrowRight size={20} />
              </motion.button>
              <div className="flex items-center gap-4 px-6 text-slate-400">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <User size={20} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold">+100 Proyectos este año</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#19a8aa]/20 to-transparent rounded-[3rem] -rotate-3 blur-2xl"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 bg-white">
              <img
                src="/images/hero_window.png"
                alt="Modern Windows Luxury House"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barra de Características */}
      <section className="bg-white border-y border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8 md:gap-12">
          <FeatureItem icon={<Zap className="text-amber-500" />} title="Rápido" desc="Cotizaciones en segundos" />
          <FeatureItem icon={<Settings className="text-blue-500" />} title="A Medida" desc="Personalización total" />
          <FeatureItem icon={<Clock className="text-emerald-500" />} title="Eficiente" desc="Sistemas de alto ahorro" />
        </div>
      </section>

      {/* Tarjetas de Categorías */}
      <section id="categories" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">Nuestras Líneas de Soluciones</h2>
            <p className="text-xl text-slate-500 font-medium">Selecciona el material que mejor se adapte a tu proyecto y comienza a diseñar hoy mismo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -12 }}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className={`${cat.color} ${cat.shadow} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{cat.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 h-18 line-clamp-2">
                  {cat.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {cat.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${cat.color}`}></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => user ? navigate(cat.link) : navigate('/login')}
                  className="w-full py-4 px-6 bg-slate-50 group-hover:bg-slate-900 text-slate-900 group-hover:text-white rounded-2xl font-bold flex justify-between items-center transition-all duration-300"
                >
                  Abrir Cotizador
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img src="/images/logo.png" alt="Logo Cripter" className="w-8 h-8 object-contain opacity-80" />
            </div>
            <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
              Líderes en soluciones de cerramientos de alto desempeño. Innovación digital para simplificar tu proceso de construcción.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Cotizadores</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><button onClick={() => navigate('/aluminio')} className="hover:text-white transition-colors">Ventanas Aluminio</button></li>
              <li><button onClick={() => navigate('/cotizador-termopaneles')} className="hover:text-white transition-colors">Termopaneles</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Contacto</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li className="flex items-center gap-2">
                <span className="text-slate-200">Email:</span>
                <a href="mailto:cripter.programas@gmail.com" className="hover:text-white transition-colors">cripter.programas@gmail.com</a>
              </li>
              <li>Chile</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold tracking-tight">
            © 2025 Cripter Limitada. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-black text-slate-800 leading-none mb-1 tracking-tight">{title}</h4>
        <p className="text-slate-400 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}

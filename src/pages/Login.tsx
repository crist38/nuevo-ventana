import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        navigate('/aluminio');
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const target: any = e.target;
    setError(null);
    try {
      if (isRegistering) {
        const nombre = target.nombre.value;
        const apellido = target.apellido.value;
        const cargo = target.cargo.value;

        const userCredential = await createUserWithEmailAndPassword(auth, target.email.value, target.password.value);
        const newUser = userCredential.user;

        await setDoc(doc(db, 'users', newUser.uid), {
          nombre,
          apellido,
          cargo,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          rol: 'user',
        });
      } else {
        await signInWithEmailAndPassword(auth, target.email.value, target.password.value);
      }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado.');
      } else if (e.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Correo inválido.');
      } else if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setError('Credenciales incorrectas.');
      } else {
        setError(e.message);
      }
    }
  }

  async function verifyUserRole(user: any) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        nombre: user.displayName?.split(' ')[0] || 'Usuario',
        apellido: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        rol: 'user',
      });
    }
  }

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await verifyUserRole(result.user);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError('Error al iniciar con Google. Intenta nuevamente.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="Logo Cripter" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isRegistering ? 'Completa tus datos para registrarte' : 'Ingresa a tu cuenta para continuar'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="text-red-400 mb-4 border border-red-500/30 p-3 rounded-lg bg-red-500/10 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={doLogin} className="space-y-4">
            {isRegistering && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Nombre</label>
                    <input
                      name="nombre"
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Apellido</label>
                    <input
                      name="apellido"
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Cargo</label>
                  <input
                    name="cargo"
                    type="text"
                    placeholder="Ej. Vendedor, Instalador"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                required
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
              <LogIn className="w-4 h-4" />
              {isRegistering ? 'Registrarse' : 'Entrar'}
            </button>
          </form>

          <div className="relative flex items-center justify-center text-sm my-5">
            <div className="border-t border-slate-700 w-full absolute"></div>
            <span className="bg-slate-900 px-3 text-slate-500 relative z-10 text-xs uppercase tracking-wider">O continuar con</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 py-3 rounded-lg font-medium flex items-center justify-center gap-3 transition-colors text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google Account
          </button>
        </div>

        <div className="mt-5 text-center text-sm">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {isRegistering
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

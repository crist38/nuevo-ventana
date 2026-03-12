import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { ArrowLeft, Trash2, LayoutDashboard, Search } from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    nombre?: string;
    apellido?: string;
    cargo?: string;
    rol: 'admin' | 'user';
    createdAt?: string;
}

export const Users: React.FC = () => {
    const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'));
            const snap = await getDocs(q);
            const usersList: AdminUser[] = [];
            snap.forEach(docSnap => {
                usersList.push({ id: docSnap.id, ...docSnap.data() } as AdminUser);
            });
            // Sort to show newest first? Or alphabetical. Let's do alphabetical by email for now
            usersList.sort((a, b) => a.email.localeCompare(b.email));
            setAllUsers(usersList);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            alert("Error al cargar usuarios: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateRole(userId: string, newRole: 'admin' | 'user') {
        try {
            await updateDoc(doc(db, 'users', userId), { rol: newRole });
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error al actualizar el rol. Revisa si tienes permisos.");
        }
    }

    async function handleDeleteUser(userId: string) {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esto no borrará su cuenta de Authentication, solo sus permisos locales.")) return;
        try {
            await deleteDoc(doc(db, 'users', userId));
            setAllUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error al eliminar el usuario");
        }
    }

    const filteredUsers = allUsers.filter(u => {
        const matchesRol = filterRol === 'todos' || u.rol === filterRol;
        const matchesSearch = 
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.nombre && u.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.apellido && u.apellido.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesRol && matchesSearch;
    });

    return (
        <div className="h-full overflow-y-auto bg-slate-950 text-slate-200 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Volver"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Gestión de Usuarios
                            </h1>
                            <p className="text-slate-400 mt-1">Administra los accesos y roles de tu equipo.</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setFilterRol('todos')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterRol === 'todos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Todos ({allUsers.length})
                        </button>
                        <button 
                            onClick={() => setFilterRol('admin')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterRol === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Admin
                        </button>
                        <button 
                            onClick={() => setFilterRol('user')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterRol === 'user' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Vendedores
                        </button>
                    </div>
                </header>

                <div className="flex justify-between items-center mb-6 gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por correo o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    
                    <button
                        onClick={fetchUsers}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2"
                        title="Refrescar Lista"
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-semibold hidden sm:inline">Recargar</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center p-12 text-slate-400">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Cargando usuarios...
                    </div>
                ) : (
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-950 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Usuario</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contacto</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rol</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Registro</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    <>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                    No se encontraron usuarios con esos filtros.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <tr
                                                    key={u.id}
                                                    className="hover:bg-slate-800/50 transition-all duration-200"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-emerald-400 border border-slate-700">
                                                                {u.nombre?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-200">
                                                                    {u.nombre ? `${u.nombre} ${u.apellido || ''}` : 'Sin Nombre'}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                                                                    {u.cargo || 'Sin Cargo'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-medium text-slate-400">{u.email}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <select
                                                            value={u.rol}
                                                            onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                                                            className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-emerald-500 cursor-pointer outline-none ${
                                                                u.rol === 'admin' 
                                                                ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' 
                                                                : 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                                                            }`}
                                                        >
                                                            <option value="user" className="bg-slate-900 text-slate-200">Vendedor</option>
                                                            <option value="admin" className="bg-slate-900 text-slate-200">Administrador</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="w-9 h-9 flex items-center justify-center bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-all border border-red-900/30"
                                                                title="Eliminar Permisos de Usuario"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

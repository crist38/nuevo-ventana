import React, { useEffect, useState, useId } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { ArrowLeft, Save } from 'lucide-react';

import { DEFAULT_ALUMINIO, DEFAULT_VIDRIOS_DOC, smartMerge } from '../lib/data/configuracion';
import type { ConfigDoc } from '../lib/data/configuracion';

export const Configuracion: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<ConfigDoc | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [material, setMaterial] = useState<'aluminio' | 'vidrios'>('aluminio');

    const basePriceId = useId();

    useEffect(() => {
        fetchConfig();
    }, [material]);

    const getCurrentDefaults = () => (material === 'vidrios' ? DEFAULT_VIDRIOS_DOC : DEFAULT_ALUMINIO);

    async function fetchConfig() {
        setLoading(true);
        setError(null);
        try {
            const refDoc = doc(db, 'configuracion', material);
            const snap = await getDoc(refDoc);
            const defaults = getCurrentDefaults();

            if (!snap.exists()) {
                try {
                    await setDoc(refDoc, defaults);
                } catch (err) {
                    console.warn("No se pudo crear la configuración por defecto en la nube (requiere ser administrador). Usando valores locales en memoria.");
                }
                setConfig(defaults);
                setLoading(false);
                return;
            }

            const data = snap.data() as ConfigDoc;

            const mergedConfig: ConfigDoc = {
                preciosBase: { ...defaults.preciosBase, ...data.preciosBase },
                aperturas: smartMerge(defaults.aperturas, data.aperturas),
                colores: smartMerge(defaults.colores, data.colores),
                manillas: smartMerge(defaults.manillas, data.manillas),
                vidrios: smartMerge(defaults.vidrios, data.vidrios),
                accesorios: smartMerge(defaults.accesorios, data.accesorios),
            };

            setConfig(mergedConfig);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function saveConfig(updated: ConfigDoc) {
        try {
            await setDoc(doc(db, 'configuracion', material), updated, { merge: true });
            setConfig(updated);
            alert('Configuración guardada correctamente.');
        } catch (e: any) {
            alert('Error guardando: ' + e.message);
        }
    }

    async function addOption(collectionKey: keyof ConfigDoc, key: string, payload: any) {
        if (!config) return;
        const newConfig = JSON.parse(JSON.stringify(config)) as ConfigDoc;

        // @ts-ignore
        newConfig[collectionKey][key] = payload;

        await saveConfig(newConfig);
    }

    async function editOption(collectionKey: keyof ConfigDoc, key: string, payload: any) {
        if (!config) return;
        const newConfig = JSON.parse(JSON.stringify(config)) as ConfigDoc;

        // @ts-ignore
        newConfig[collectionKey][key] = { ...newConfig[collectionKey][key], ...payload };

        await saveConfig(newConfig);
    }

    async function deleteOption(collectionKey: keyof ConfigDoc, key: string) {
        if (!config) return;

        const refDoc = doc(db, 'configuracion', material);

        await runTransaction(db, async (t) => {
            const snap = await t.get(refDoc);
            const data = snap.data() as any;
            if(data && data[collectionKey]){
                delete data[collectionKey][key];
                t.set(refDoc, data);
            }
        });

        const newConfig = { ...config } as any;
        delete newConfig[collectionKey][key];
        setConfig(newConfig);
    }

    const categories: (keyof ConfigDoc)[] = ['aperturas', 'colores', 'manillas', 'vidrios', 'accesorios'];

    return (
        <div className="h-full overflow-y-auto bg-slate-950 text-slate-200 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Volver"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Configuración General</h1>
                </header>

                <section className="flex gap-4 mb-8">
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                        <button
                            onClick={() => { setConfig(null); setMaterial('aluminio'); }}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${material === 'aluminio' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Aluminio
                        </button>
                        <button
                            onClick={() => { setConfig(null); setMaterial('vidrios'); }}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${material === 'vidrios' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Cristales
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                        Error al cargar la configuración: {error}
                    </div>
                )}

                {loading || !config ? (
                    <div className="text-center p-12 text-slate-400">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Cargando configuración...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {material === 'vidrios' ? (
                            <div className="lg:col-span-3 space-y-6">
                                <CollectionEditor
                                    key="vidrios"
                                    label="Catálogo de Cristales"
                                    data={config.vidrios}
                                    colKey="vidrios"
                                    onAdd={addOption}
                                    onEdit={editOption}
                                    onDelete={deleteOption}
                                />
                            </div>
                        ) : (
                            <>
                                {/* PRECIO BASE */}
                                <section className="lg:col-span-1">
                                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg sticky top-6">
                                        <h2 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                                            Precio Base Global
                                        </h2>

                                        <div className="mb-6">
                                            <label htmlFor={basePriceId} className="block text-sm font-medium text-slate-400 mb-2">
                                                Monto Base ($)
                                            </label>
                                            <input
                                                id={basePriceId}
                                                type="number"
                                                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={config.preciosBase.base}
                                                onChange={(e) =>
                                                    setConfig(prev => prev ? { ...prev, preciosBase: { base: parseInt(e.target.value) || 0 } } : prev)
                                                }
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Este valor afecta el cálculo global por metro cuadrado.</p>
                                        </div>

                                        <button
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors"
                                            onClick={() => saveConfig(config)}
                                        >
                                            <Save className="w-5 h-5" />
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </section>

                                {/* CATEGORIAS */}
                                <section className="lg:col-span-2 space-y-6">
                                    {categories.map((colKey) => (
                                        <CollectionEditor
                                            key={colKey}
                                            label={colKey}
                                            data={(config as any)[colKey]}
                                            colKey={colKey}
                                            onAdd={addOption}
                                            onEdit={editOption}
                                            onDelete={deleteOption}
                                        />
                                    ))}
                                </section>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

function CollectionEditor({ label, data, colKey, onAdd, onEdit, onDelete }: any) {
    const [keyInput, setKeyInput] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [priceInput, setPriceInput] = useState<number>(0);

    const formKeyId = useId();
    const formLabelId = useId();
    const formPriceId = useId();

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!keyInput) return alert("Ingrese clave");

        await onAdd(colKey, keyInput, {
            label: labelInput || keyInput,
            price: priceInput,
        });

        setKeyInput('');
        setLabelInput('');
        setPriceInput(0);
    }

    return (
        <article className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-white capitalize border-b border-slate-800 pb-2">{label}</h3>

            {/* LISTA ACTUAL */}
            <ul className="space-y-3 mb-8">
                {Object.entries(data).map(([k, v]: any) => (
                    <li key={k} className="flex flex-col sm:flex-row justify-between bg-slate-950 p-4 rounded-lg border border-slate-800 gap-4">
                        <div>
                            <div className="font-semibold text-slate-200">{v.label}</div>
                            <div className="text-xs text-slate-500 font-mono mt-1">ID: {k}</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                                ${v.price.toLocaleString()}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const newLabel = prompt(`Nuevo nombre para ${v.label}:`, v.label);
                                        if (newLabel === null) return;
                                        const newPrice = prompt(`Nuevo precio para ${v.label}:`, v.price);
                                        if (newPrice === null) return;

                                        onEdit(colKey, k, { label: newLabel, price: parseInt(newPrice) || 0 });
                                    }}
                                    className="text-sm px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if(confirm(`¿Estás seguro de borrar ${v.label}?`)) {
                                            onDelete(colKey, k);
                                        }
                                    }}
                                    className="text-sm px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* FORMULARIO AGREGAR */}
            <div className="bg-slate-950 p-5 rounded-lg border border-dashed border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 mb-4">Agregar nuevo elemento a {label}</h4>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label htmlFor={formKeyId} className="block text-xs font-medium text-slate-500 mb-1">Clave (ID único)</label>
                        <input
                            id={formKeyId}
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="Ej. accesorio_nuevo"
                            className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="md:col-span-4">
                        <label htmlFor={formLabelId} className="block text-xs font-medium text-slate-500 mb-1">Nombre Visible</label>
                        <input
                            id={formLabelId}
                            value={labelInput}
                            onChange={(e) => setLabelInput(e.target.value)}
                            placeholder="Ej. Accesorio Nuevo"
                            className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label htmlFor={formPriceId} className="block text-xs font-medium text-slate-500 mb-1">Precio ($)</label>
                        <input
                            id={formPriceId}
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2 rounded font-medium transition-colors border border-slate-700">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </article>
    );
}

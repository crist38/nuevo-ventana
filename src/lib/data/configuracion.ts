import { VIDRIOS_FLAT } from './vidrios';

export type PriceMap = Record<string, { label: string; price: number; image?: string }>;

export type ConfigDoc = {
    preciosBase: { base: number };
    aperturas: PriceMap;
    colores: PriceMap;
    manillas: PriceMap;
    vidrios: PriceMap;
    accesorios: PriceMap;
};

export const DEFAULT_ALUMINIO: ConfigDoc = {
    preciosBase: { base: 60000 },
    aperturas: {
        fijo: { label: 'Fijo', price: 0 },
        corredera: { label: 'Corredera', price: 25000 },
        proyectante: { label: 'Proyectante', price: 30000 },
        abatible: { label: 'Abatible', price: 34000 },
        oscilobatiente: { label: 'Oscilobatiente', price: 55000 },
        puerta: { label: 'Puerta', price: 45000 },
        practicable: { label: 'Practicable', price: 34000 },
        shower_door: { label: 'Shower Door', price: 55000 },
    },
    colores: {
        blanco: { label: 'Blanco', price: 26000 },
        mate: { label: 'Mate', price: 20000 },
        titanio: { label: 'Titanio', price: 28000 },
        negro: { label: 'Negro', price: 30000 },
        nogal: { label: 'Nogal', price: 33000 },
        roble_dorado: { label: 'Roble Dorado', price: 35000 },
    },
    manillas: {
        blanco: { label: 'Manilla Blanca', price: 0 },
        negro: { label: 'Manilla Negra', price: 5000 },
    },
    vidrios: {
        simple: { label: 'Vidrio Simple', price: 10000 },
        doble: { label: 'Doble Vidrio (DVH)', price: 29000 },
        triple: { label: 'Triple Vidrio', price: 40000 },
    },
    accesorios: {
        Palillos: { label: 'Palillaje', price: 3000 },
        cierre: { label: 'Mosquitero', price: 50000 },
        cremona: { label: 'Cremona', price: 19000 },
        zocalo: { label: 'Zócalo', price: 14000 },
    },
};

export const DEFAULT_VIDRIOS_DOC: ConfigDoc = {
    preciosBase: { base: 0 },
    aperturas: {},
    colores: {},
    manillas: {},
    vidrios: VIDRIOS_FLAT.reduce((acc, v) => {
        acc[v.value] = { label: v.label, price: v.price };
        return acc;
    }, {} as PriceMap),
    accesorios: {},
};

export function smartMerge(defaultMap: PriceMap, dbMap: any) {
    const result = { ...defaultMap };
    if (!dbMap) return result;

    Object.keys(dbMap).forEach((key) => {
        const dbItem = dbMap[key];
        const defaultItem = result[key];
        result[key] = defaultItem ? { ...defaultItem, ...dbItem } : dbItem;
    });
    return result;
}

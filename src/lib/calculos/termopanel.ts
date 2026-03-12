export interface TermopanelItem {
    id: string;
    cantidad: number;
    ancho: number;
    alto: number;
    cristal1: { tipo: string; espesor: number };
    cristal2: { tipo: string; espesor: number };
    separador: { espesor: number; color: string };
    gas: boolean;
    micropersiana: boolean;
    palillaje: boolean;
    precioUnitario: number;
}

export function calcularItem(item: TermopanelItem): { totalLinea: number } {
    let subtotal = item.precioUnitario;
    
    // Add additional costs for gas, micropersiana, palillaje if checked
    const areaM2 = (item.ancho * item.alto) / 1000000;
    if (item.gas) subtotal += 5000 * areaM2;
    if (item.micropersiana) subtotal += 45000 * areaM2;
    if (item.palillaje) subtotal += 12000 * areaM2;

    return {
        totalLinea: Math.round(subtotal * item.cantidad)
    };
}

export function calcularTotal(items: TermopanelItem[]): number {
    return items.reduce((acc, current) => {
        return acc + calcularItem(current).totalLinea;
    }, 0);
}

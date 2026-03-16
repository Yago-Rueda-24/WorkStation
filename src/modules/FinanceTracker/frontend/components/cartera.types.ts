export interface CarteraMiembro {
    id: number;
    tipo: 'cuenta_corriente' | 'inversion';
    nombre: string;
    saldo: number;
    moneda: string;
}

export interface Cartera {
    id: number;
    nombre: string;
    descripcion: string | null;
    saldoTotal: number;
    cuentas: CarteraMiembro[];
    createdAt: string;
}

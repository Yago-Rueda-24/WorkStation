// ── Navegación ────────────────────────────────────────────────────────────────

export type FinanceView = 'dashboard' | 'cuentas' | 'inversiones' | 'carteras';

// ── Compartido ────────────────────────────────────────────────────────────────

export interface CarteraOption {
    id: number;
    nombre: string;
}

// ── Cartera ───────────────────────────────────────────────────────────────────

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

// ── Cuenta corriente ──────────────────────────────────────────────────────────

export interface CuentaCorriente {
    id: number;
    nombre: string;
    saldo: number;
    iban: string | null;
    banco: string | null;
    moneda: string;
    createdAt: string;
}

export interface CuentaFormData {
    nombre: string;
    saldo: number;
    iban: string | null;
    banco: string | null;
    moneda: string;
    carteraId: number | null;
}

// ── Transacción ───────────────────────────────────────────────────────────────

export interface Transaction {
    id: number;
    nombre: string;
    descripcion: string;
    valor: number;
    cuentaCorrienteId: number;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionFormData {
    nombre: string;
    descripcion: string;
    valor: number;
    cuentaCorrienteId: number;
}

// ── Inversión ─────────────────────────────────────────────────────────────────

export type TipoInversion = 'acciones' | 'fondos' | 'cripto' | 'deposito' | 'otro';

export interface Inversion {
    id: number;
    nombre: string;
    /** Valor de mercado actual. */
    saldo: number;
    /** Capital inicial invertido. */
    valorInicial: number;
    /** Efectivo disponible en la cuenta de inversión. */
    efectivoDisponible: number;
    tipo: TipoInversion;
    fechaInicio: string | null;
    moneda: string;
    /** Calculado en el backend: ((saldo - valorInicial) / valorInicial) * 100 */
    rentabilidad: number;
    createdAt: string;
}

export interface InversionFormData {
    nombre: string;
    saldo: number;
    valorInicial: number;
    efectivoDisponible: number;
    tipo: TipoInversion;
    fechaInicio: string | null;
    moneda: string;
    carteraId: number | null;
}

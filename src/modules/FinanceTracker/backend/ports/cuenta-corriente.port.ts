import { CuentaCorriente } from '../domain/cuenta-corriente.entity';

export interface CreateCuentaCorrienteData {
    nombre: string;
    saldo?: number;
    iban?: string | null;
    banco?: string | null;
    moneda?: string;
}

export interface UpdateCuentaCorrienteData {
    nombre?: string;
    saldo?: number;
    iban?: string | null;
    banco?: string | null;
    moneda?: string;
}

export interface ICuentaCorrientePort {
    findAll(): Promise<CuentaCorriente[]>;
    findById(id: number): Promise<CuentaCorriente | null>;
    create(data: CreateCuentaCorrienteData): Promise<CuentaCorriente>;
    update(id: number, data: UpdateCuentaCorrienteData): Promise<CuentaCorriente | null>;
    delete(id: number): Promise<boolean>;
}

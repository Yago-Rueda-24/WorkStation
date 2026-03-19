import { Transaction } from '../domain/transaction.entity';

export interface CreateTransactionData {
    nombre: string;
    descripcion: string;
    valor: number;
    cuentaCorrienteId: number;
}

export interface UpdateTransactionData {
    nombre?: string;
    descripcion?: string;
    valor?: number;
    cuentaCorrienteId?: number;
}

export interface ITransactionPort {
    findAll(): Promise<Transaction[]>;
    findByCuentaCorrienteId(cuentaCorrienteId: number): Promise<Transaction[]>;
    findByCuentaCorrienteIdAndMonth(cuentaCorrienteId: number): Promise<Transaction[]>;
    findById(id: number): Promise<Transaction | null>;
    create(data: CreateTransactionData): Promise<Transaction>;
    update(id: number, data: UpdateTransactionData): Promise<Transaction | null>;
    delete(id: number): Promise<boolean>;
}

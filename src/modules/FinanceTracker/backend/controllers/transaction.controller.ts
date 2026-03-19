import { Transaction } from '../domain/transaction.entity';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionData, UpdateTransactionData } from '../ports/transaction.port';

export class TransactionController {
    constructor(private readonly service: TransactionService) { }

    private serialize(transaction: Transaction): Record<string, unknown> {
        return {
            id: transaction.id,
            nombre: transaction.nombre,
            descripcion: transaction.descripcion,
            valor: transaction.valor,
            cuentaCorrienteId: transaction.cuentaCorriente?.id,
            createdAt: transaction.createdAt instanceof Date
                ? transaction.createdAt.toISOString()
                : new Date(String(transaction.createdAt)).toISOString(),
            updatedAt: transaction.updatedAt instanceof Date
                ? transaction.updatedAt.toISOString()
                : new Date(String(transaction.updatedAt)).toISOString(),
        };
    }

    async handleTransactionGetAll(): Promise<Record<string, unknown>[]> {
        const transactions = await this.service.getAll();
        return transactions.map(t => this.serialize(t));
    }

    async handleTransactionGetByCuenta(payload: { cuentaCorrienteId: number }): Promise<Record<string, unknown>[]> {
        const transactions = await this.service.getByCuentaCorrienteId(payload.cuentaCorrienteId);
        return transactions.map(t => this.serialize(t));
    }
    async handleTransactionGetByCuentaAndMonth(payload: { cuentaCorrienteId: number }): Promise<Record<string, unknown>[]> {
        const transactions = await this.service.getByCuentaCorrienteIdAndMonth(payload.cuentaCorrienteId);
        return transactions.map(t => this.serialize(t));
    }

    async handleTransactionGetById(payload: { id: number }): Promise<Record<string, unknown> | null> {
        const transaction = await this.service.getById(payload.id);
        return transaction ? this.serialize(transaction) : null;
    }

    async handleTransactionCreate(payload: CreateTransactionData): Promise<Record<string, unknown>> {
        const transaction = await this.service.create(payload);
        return this.serialize(transaction);
    }

    async handleTransactionUpdate(payload: { id: number } & UpdateTransactionData): Promise<Record<string, unknown>> {
        const { id, ...data } = payload;
        const transaction = await this.service.update(id, data);
        return this.serialize(transaction);
    }

    async handleTransactionDelete(payload: { id: number }): Promise<boolean> {
        return this.service.delete(payload.id);
    }
}

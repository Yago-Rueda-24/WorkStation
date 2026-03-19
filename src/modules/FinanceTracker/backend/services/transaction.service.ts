import { Transaction } from '../domain/transaction.entity';
import { ITransactionPort, CreateTransactionData, UpdateTransactionData } from '../ports/transaction.port';
import { CuentaCorrienteService } from './cuenta-corriente.service';

export class TransactionService {
    constructor(private readonly transactionPort: ITransactionPort, private readonly cuentaCorrienteService: CuentaCorrienteService) { }

    async getAll(): Promise<Transaction[]> {
        return this.transactionPort.findAll();
    }

    async getByCuentaCorrienteId(cuentaCorrienteId: number): Promise<Transaction[]> {
        return this.transactionPort.findByCuentaCorrienteId(cuentaCorrienteId);
    }
    async getByCuentaCorrienteIdAndMonth(cuentaCorrienteId: number): Promise<Transaction[]> {
        return this.transactionPort.findByCuentaCorrienteIdAndMonth(cuentaCorrienteId);
    }

    async getById(id: number): Promise<Transaction | null> {
        return this.transactionPort.findById(id);
    }

    async create(data: CreateTransactionData): Promise<Transaction> {
        if (!data.nombre?.trim()) {
            throw new Error('El nombre de la transacción es obligatorio.');
        }
        if (!data.cuentaCorrienteId) {
            throw new Error('La transacción debe pertenecer a una cuenta corriente.');
        }
        const cuenta = await this.cuentaCorrienteService.getById(data.cuentaCorrienteId);
        if (!cuenta) {
            throw new Error('La cuenta corriente no existe.');
        }
        cuenta.saldo += data.valor;
        await this.cuentaCorrienteService.update(cuenta.id, cuenta);
        return this.transactionPort.create(data);
    }

    async update(id: number, data: UpdateTransactionData): Promise<Transaction> {
        const updated = await this.transactionPort.update(id, data);
        if (!updated) throw new Error(`Transacción con id ${id} no encontrada.`);
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const trx = await this.transactionPort.findById(id);
        if (!trx) throw new Error(`Transacción con id ${id} no encontrada.`);

        const deleted = await this.transactionPort.delete(id);
        if (deleted && trx.cuentaCorriente) {
            const cuenta = await this.cuentaCorrienteService.getById(trx.cuentaCorriente.id);
            if (cuenta) {
                cuenta.saldo -= trx.valor;
                await this.cuentaCorrienteService.update(cuenta.id, cuenta);
            }
        }
        return deleted;
    }
}

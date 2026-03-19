import { DataSource, Repository, Between } from 'typeorm';
import { Transaction } from '../domain/transaction.entity';
import { ITransactionPort, CreateTransactionData, UpdateTransactionData } from '../ports/transaction.port';

export class TransactionRepository implements ITransactionPort {
    private readonly repository: Repository<Transaction>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Transaction);
    }


    async findAll(): Promise<Transaction[]> {
        return this.repository.find({
            order: { createdAt: 'DESC' },
            relations: ['cuentaCorriente']
        });
    }

    async findByCuentaCorrienteId(cuentaCorrienteId: number): Promise<Transaction[]> {
        return this.repository.find({
            where: { cuentaCorriente: { id: cuentaCorrienteId } },
            order: { createdAt: 'DESC' },
            relations: ['cuentaCorriente']
        });
    }
    async findByCuentaCorrienteIdAndMonth(cuentaCorrienteId: number): Promise<Transaction[]> {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        return this.repository.find({
            where: {
                cuentaCorriente: { id: cuentaCorrienteId }, createdAt: Between(
                    new Date(year, month - 1, 1),
                    new Date(year, month, 1)
                )
            },
            order: { createdAt: 'DESC' },
            relations: ['cuentaCorriente'],

        });
    }

    async findById(id: number): Promise<Transaction | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['cuentaCorriente']
        });
    }

    async create(data: CreateTransactionData): Promise<Transaction> {
        const { cuentaCorrienteId, ...rest } = data;
        const transaction = this.repository.create({
            ...rest,
            cuentaCorriente: { id: cuentaCorrienteId }
        });
        return this.repository.save(transaction);
    }

    async update(id: number, data: UpdateTransactionData): Promise<Transaction | null> {
        const transaction = await this.findById(id);
        if (!transaction) return null;

        const { cuentaCorrienteId, ...rest } = data;
        if (cuentaCorrienteId !== undefined) {
            transaction.cuentaCorriente = { id: cuentaCorrienteId } as any;
        }
        Object.assign(transaction, rest);

        return this.repository.save(transaction);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}

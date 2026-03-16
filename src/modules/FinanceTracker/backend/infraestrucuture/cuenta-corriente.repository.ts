import { DataSource, Repository } from 'typeorm';
import { CuentaCorriente } from '../domain/cuenta-corriente.entity';
import { ICuentaCorrientePort, CreateCuentaCorrienteData, UpdateCuentaCorrienteData } from '../ports/cuenta-corriente.port';

export class CuentaCorrienteRepository implements ICuentaCorrientePort {
    private readonly repository: Repository<CuentaCorriente>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(CuentaCorriente);
    }

    async findAll(): Promise<CuentaCorriente[]> {
        return this.repository.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<CuentaCorriente | null> {
        return this.repository.findOneBy({ id });
    }

    async create(data: CreateCuentaCorrienteData): Promise<CuentaCorriente> {
        const cuenta = this.repository.create(data);
        return this.repository.save(cuenta);
    }

    async update(id: number, data: UpdateCuentaCorrienteData): Promise<CuentaCorriente | null> {
        const cuenta = await this.repository.findOneBy({ id });
        if (!cuenta) return null;

        Object.assign(cuenta, data);
        return this.repository.save(cuenta);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}

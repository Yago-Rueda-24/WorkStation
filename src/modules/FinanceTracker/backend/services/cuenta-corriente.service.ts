import { CuentaCorriente } from '../domain/cuenta-corriente.entity';
import { ICuentaCorrientePort, CreateCuentaCorrienteData, UpdateCuentaCorrienteData } from '../ports/cuenta-corriente.port';

export class CuentaCorrienteService {
    constructor(private readonly cuentaPort: ICuentaCorrientePort) {}

    async getAll(): Promise<CuentaCorriente[]> {
        return this.cuentaPort.findAll();
    }

    async getById(id: number): Promise<CuentaCorriente | null> {
        return this.cuentaPort.findById(id);
    }

    async create(data: CreateCuentaCorrienteData): Promise<CuentaCorriente> {
        if (!data.nombre?.trim()) {
            throw new Error('El nombre de la cuenta es obligatorio.');
        }
        if (data.saldo !== undefined && data.saldo < 0) {
            throw new Error('El saldo inicial no puede ser negativo.');
        }
        return this.cuentaPort.create(data);
    }

    async update(id: number, data: UpdateCuentaCorrienteData): Promise<CuentaCorriente> {
        if (data.saldo !== undefined && data.saldo < 0) {
            throw new Error('El saldo no puede ser negativo.');
        }
        const updated = await this.cuentaPort.update(id, data);
        if (!updated) throw new Error(`Cuenta corriente con id ${id} no encontrada.`);
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await this.cuentaPort.delete(id);
        if (!deleted) throw new Error(`Cuenta corriente con id ${id} no encontrada.`);
        return deleted;
    }

    /** Suma del saldo de todas las cuentas corrientes. Útil para el dashboard. */
    async getTotalSaldo(): Promise<number> {
        const cuentas = await this.cuentaPort.findAll();
        return cuentas.reduce((sum, c) => sum + c.saldo, 0);
    }
}

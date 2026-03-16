import { CuentaCorriente } from '../domain/cuenta-corriente.entity';
import { CuentaCorrienteService } from '../services/cuenta-corriente.service';
import { CreateCuentaCorrienteData, UpdateCuentaCorrienteData } from '../ports/cuenta-corriente.port';

export class CuentaCorrienteController {
    constructor(private readonly service: CuentaCorrienteService) {}

    private serialize(cuenta: CuentaCorriente): Record<string, unknown> {
        return {
            id: cuenta.id,
            nombre: cuenta.nombre,
            saldo: cuenta.saldo,
            iban: cuenta.iban ?? null,
            banco: cuenta.banco ?? null,
            moneda: cuenta.moneda,
            createdAt: cuenta.createdAt instanceof Date
                ? cuenta.createdAt.toISOString()
                : new Date(String(cuenta.createdAt)).toISOString(),
        };
    }

    async handleCuentaGetAll(): Promise<Record<string, unknown>[]> {
        const cuentas = await this.service.getAll();
        return cuentas.map(c => this.serialize(c));
    }

    async handleCuentaGetById(payload: { id: number }): Promise<Record<string, unknown> | null> {
        const cuenta = await this.service.getById(payload.id);
        return cuenta ? this.serialize(cuenta) : null;
    }

    async handleCuentaCreate(payload: CreateCuentaCorrienteData): Promise<Record<string, unknown>> {
        const cuenta = await this.service.create(payload);
        return this.serialize(cuenta);
    }

    async handleCuentaUpdate(payload: { id: number } & UpdateCuentaCorrienteData): Promise<Record<string, unknown>> {
        const { id, ...data } = payload;
        const cuenta = await this.service.update(id, data);
        return this.serialize(cuenta);
    }

    async handleCuentaDelete(payload: { id: number }): Promise<boolean> {
        return this.service.delete(payload.id);
    }

    async handleCuentaGetTotalSaldo(): Promise<number> {
        return this.service.getTotalSaldo();
    }
}

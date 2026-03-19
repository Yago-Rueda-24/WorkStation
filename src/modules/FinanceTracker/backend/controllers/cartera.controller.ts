import { Cartera } from '../domain/cartera.entity';
import { CuentaCorriente } from '../domain/cuenta-corriente.entity';
import { Inversion } from '../domain/inversion.entity';
import { CarteraService } from '../services/cartera.service';
import { CreateCarteraData, UpdateCarteraData } from '../ports/cartera.port';

export class CarteraController {
    constructor(private readonly service: CarteraService) {}

    private serializeMiembro(cuenta: CuentaCorriente | Inversion): Record<string, unknown> {
        const base = {
            id: cuenta.id,
            tipo: cuenta instanceof Inversion ? 'inversion' : 'cuenta_corriente',
            nombre: cuenta.nombre,
            saldo: cuenta instanceof Inversion ? cuenta.valorTotal : cuenta.saldo,
            moneda: cuenta.moneda,
            createdAt: cuenta.createdAt instanceof Date
                ? cuenta.createdAt.toISOString()
                : new Date(String(cuenta.createdAt)).toISOString(),
        };

        if (cuenta instanceof CuentaCorriente) {
            return { ...base, iban: cuenta.iban ?? null, banco: cuenta.banco ?? null };
        }

        return {
            ...base,
            valorInicial: cuenta.valorInicial,
            tipoInversion: cuenta.tipo,
            rentabilidad: cuenta.rentabilidad,
            fechaInicio: cuenta.fechaInicio instanceof Date
                ? cuenta.fechaInicio.toISOString()
                : cuenta.fechaInicio ?? null,
        };
    }

    private serialize(cartera: Cartera): Record<string, unknown> {
        return {
            id: cartera.id,
            nombre: cartera.nombre,
            descripcion: cartera.descripcion ?? null,
            saldoTotal: cartera.saldoTotal,
            cuentas: cartera.cuentas.map(c => this.serializeMiembro(c as CuentaCorriente | Inversion)),
            createdAt: cartera.createdAt instanceof Date
                ? cartera.createdAt.toISOString()
                : new Date(String(cartera.createdAt)).toISOString(),
        };
    }

    async handleCarteraGetAll(): Promise<Record<string, unknown>[]> {
        const carteras = await this.service.getAll();
        return carteras.map(c => this.serialize(c));
    }

    async handleCarteraGetById(payload: { id: number }): Promise<Record<string, unknown> | null> {
        const cartera = await this.service.getById(payload.id);
        return cartera ? this.serialize(cartera) : null;
    }

    async handleCarteraCreate(payload: CreateCarteraData): Promise<Record<string, unknown>> {
        return this.serialize(await this.service.create(payload));
    }

    async handleCarteraUpdate(payload: { id: number } & UpdateCarteraData): Promise<Record<string, unknown>> {
        const { id, ...data } = payload;
        return this.serialize(await this.service.update(id, data));
    }

    async handleCarteraDelete(payload: { id: number }): Promise<boolean> {
        return this.service.delete(payload.id);
    }

    async handleCarteraAddCuenta(payload: { carteraId: number; cuentaId: number }): Promise<Record<string, unknown>> {
        return this.serialize(await this.service.addCuenta(payload.carteraId, payload.cuentaId));
    }

    async handleCarteraAddInversion(payload: { carteraId: number; inversionId: number }): Promise<Record<string, unknown>> {
        return this.serialize(await this.service.addInversion(payload.carteraId, payload.inversionId));
    }

    async handleCarteraRemoveCuenta(payload: { carteraId: number; cuentaId: number }): Promise<Record<string, unknown>> {
        return this.serialize(await this.service.removeCuenta(payload.carteraId, payload.cuentaId));
    }

    async handleCarteraRemoveInversion(payload: { carteraId: number; inversionId: number }): Promise<Record<string, unknown>> {
        return this.serialize(await this.service.removeInversion(payload.carteraId, payload.inversionId));
    }

    async handleCarteraGetSaldoTotal(payload: { id: number }): Promise<number> {
        return this.service.getSaldoTotal(payload.id);
    }
}

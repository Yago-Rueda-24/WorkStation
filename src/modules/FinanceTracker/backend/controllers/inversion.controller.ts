import { Inversion } from '../domain/inversion.entity';
import { InversionService } from '../services/inversion.service';
import { CreateInversionData, UpdateInversionData } from '../ports/inversion.port';

export class InversionController {
    constructor(private readonly service: InversionService) { }

    /**
     * Serialización explícita para asegurar que el getter `rentabilidad`
     * se incluye en la respuesta (los getters no se serializan automáticamente).
     */
    private serialize(inv: Inversion): Record<string, unknown> {
        return {
            id: inv.id,
            nombre: inv.nombre,
            saldo: inv.saldo,
            valorInicial: inv.valorInicial,
            efectivoDisponible: inv.efectivoDisponible,
            tipo: inv.tipo,
            fechaInicio: inv.fechaInicio instanceof Date
                ? inv.fechaInicio.toISOString()
                : inv.fechaInicio ?? null,
            moneda: inv.moneda,
            rentabilidad: inv.rentabilidad,
            createdAt: inv.createdAt instanceof Date
                ? inv.createdAt.toISOString()
                : new Date(String(inv.createdAt)).toISOString(),
        };
    }

    async handleInversionGetAll(): Promise<Record<string, unknown>[]> {
        const inversiones = await this.service.getAll();
        return inversiones.map(i => this.serialize(i));
    }

    async handleInversionGetById(payload: { id: number }): Promise<Record<string, unknown> | null> {
        const inversion = await this.service.getById(payload.id);
        return inversion ? this.serialize(inversion) : null;
    }

    async handleInversionCreate(payload: CreateInversionData): Promise<Record<string, unknown>> {
        const inversion = await this.service.create(payload);
        return this.serialize(inversion);
    }

    async handleInversionUpdate(payload: { id: number } & UpdateInversionData): Promise<Record<string, unknown>> {
        const { id, ...data } = payload;
        const inversion = await this.service.update(id, data);
        return this.serialize(inversion);
    }

    async handleInversionDelete(payload: { id: number }): Promise<boolean> {
        return this.service.delete(payload.id);
    }

    async handleInversionGetResumen(): Promise<Record<string, unknown>> {
        const [totalValor, totalInvertido, rentabilidadGlobal] = await Promise.all([
            this.service.getTotalValor(),
            this.service.getTotalInvertido(),
            this.service.getRentabilidadGlobal(),
        ]);
        return { totalValor, totalInvertido, rentabilidadGlobal };
    }
}

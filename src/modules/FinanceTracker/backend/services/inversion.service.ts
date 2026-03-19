import { Inversion } from '../domain/inversion.entity';
import { IInversionPort, CreateInversionData, UpdateInversionData } from '../ports/inversion.port';

export class InversionService {
    constructor(private readonly inversionPort: IInversionPort) { }

    async getAll(): Promise<Inversion[]> {
        return this.inversionPort.findAll();
    }

    async getById(id: number): Promise<Inversion | null> {
        return this.inversionPort.findById(id);
    }

    async create(data: CreateInversionData): Promise<Inversion> {
        if (!data.nombre?.trim()) {
            throw new Error('El nombre de la inversión es obligatorio.');
        }
        if (data.valorInicial !== undefined && data.valorInicial < 0) {
            throw new Error('El valor inicial no puede ser negativo.');
        }
        if (data.saldo === undefined) {
            throw new Error('El valor de mercado no puede ser vacio.');
        }
        return this.inversionPort.create(data);
    }

    async update(id: number, data: UpdateInversionData): Promise<Inversion> {
        if (data.valorInicial !== undefined && data.valorInicial < 0) {
            throw new Error('El valor inicial no puede ser negativo.');
        }
        if (data.saldo === undefined) {
            throw new Error('El valor de mercado no puede ser vacio.');
        }
        const updated = await this.inversionPort.update(id, data);
        if (!updated) throw new Error(`Inversión con id ${id} no encontrada.`);
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await this.inversionPort.delete(id);
        if (!deleted) throw new Error(`Inversión con id ${id} no encontrada.`);
        return deleted;
    }

    /** Valor de mercado total de todas las inversiones. */
    async getTotalValor(): Promise<number> {
        const inversiones = await this.inversionPort.findAll();
        return inversiones.reduce((sum, i) => sum + i.saldo, 0);
    }

    /** Capital total invertido en todas las posiciones. */
    async getTotalInvertido(): Promise<number> {
        const inversiones = await this.inversionPort.findAll();
        return inversiones.reduce((sum, i) => sum + i.valorInicial, 0);
    }

    /** Rentabilidad global agregada en porcentaje. */
    async getRentabilidadGlobal(): Promise<number> {
        const totalInvertido = await this.getTotalInvertido();
        if (totalInvertido === 0) return 0;
        const totalValor = await this.getTotalValor();
        return ((totalValor - totalInvertido) / totalInvertido) * 100;
    }
}

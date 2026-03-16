import { Cartera } from '../domain/cartera.entity';
import { ICarteraPort, CreateCarteraData, UpdateCarteraData } from '../ports/cartera.port';

export class CarteraService {
    constructor(private readonly carteraPort: ICarteraPort) {}

    async getAll(): Promise<Cartera[]> {
        return this.carteraPort.findAll();
    }

    async getById(id: number): Promise<Cartera | null> {
        return this.carteraPort.findById(id);
    }

    async create(data: CreateCarteraData): Promise<Cartera> {
        if (!data.nombre?.trim()) {
            throw new Error('El nombre de la cartera es obligatorio.');
        }
        return this.carteraPort.create(data);
    }

    async update(id: number, data: UpdateCarteraData): Promise<Cartera> {
        const updated = await this.carteraPort.update(id, data);
        if (!updated) throw new Error(`Cartera con id ${id} no encontrada.`);
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await this.carteraPort.delete(id);
        if (!deleted) throw new Error(`Cartera con id ${id} no encontrada.`);
        return deleted;
    }

    async addCuenta(carteraId: number, cuentaId: number): Promise<Cartera> {
        const cartera = await this.carteraPort.addCuenta(carteraId, cuentaId);
        if (!cartera) throw new Error(`No se pudo añadir la cuenta ${cuentaId} a la cartera ${carteraId}.`);
        return cartera;
    }

    async addInversion(carteraId: number, inversionId: number): Promise<Cartera> {
        const cartera = await this.carteraPort.addInversion(carteraId, inversionId);
        if (!cartera) throw new Error(`No se pudo añadir la inversión ${inversionId} a la cartera ${carteraId}.`);
        return cartera;
    }

    async removeCuenta(carteraId: number, cuentaId: number): Promise<Cartera> {
        const cartera = await this.carteraPort.removeCuenta(carteraId, cuentaId);
        if (!cartera) throw new Error(`No se pudo eliminar la cuenta ${cuentaId} de la cartera ${carteraId}.`);
        return cartera;
    }

    async removeInversion(carteraId: number, inversionId: number): Promise<Cartera> {
        const cartera = await this.carteraPort.removeInversion(carteraId, inversionId);
        if (!cartera) throw new Error(`No se pudo eliminar la inversión ${inversionId} de la cartera ${carteraId}.`);
        return cartera;
    }

    async getSaldoTotal(id: number): Promise<number> {
        const cartera = await this.carteraPort.findById(id);
        if (!cartera) throw new Error(`Cartera con id ${id} no encontrada.`);
        return cartera.saldoTotal;
    }
}

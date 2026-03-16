import { Cartera } from '../domain/cartera.entity';

export interface CreateCarteraData {
    nombre: string;
    descripcion?: string | null;
}

export interface UpdateCarteraData {
    nombre?: string;
    descripcion?: string | null;
}

export interface ICarteraPort {
    findAll(): Promise<Cartera[]>;
    findById(id: number): Promise<Cartera | null>;
    create(data: CreateCarteraData): Promise<Cartera>;
    update(id: number, data: UpdateCarteraData): Promise<Cartera | null>;
    delete(id: number): Promise<boolean>;
    addCuenta(carteraId: number, cuentaId: number): Promise<Cartera | null>;
    addInversion(carteraId: number, inversionId: number): Promise<Cartera | null>;
    removeCuenta(carteraId: number, cuentaId: number): Promise<Cartera | null>;
    removeInversion(carteraId: number, inversionId: number): Promise<Cartera | null>;
}

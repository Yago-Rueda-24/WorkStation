import { Inversion, TipoInversion } from '../domain/inversion.entity';

export interface CreateInversionData {
    nombre: string;
    saldo?: number;
    valorInicial?: number;
    efectivoDisponible?: number;
    tipo?: TipoInversion;
    fechaInicio?: string | null;
    moneda?: string;
}

export interface UpdateInversionData {
    nombre?: string;
    saldo?: number;
    valorInicial?: number;
    efectivoDisponible?: number;
    tipo?: TipoInversion;
    fechaInicio?: string | null;
    moneda?: string;
}

export interface IInversionPort {
    findAll(): Promise<Inversion[]>;
    findById(id: number): Promise<Inversion | null>;
    create(data: CreateInversionData): Promise<Inversion>;
    update(id: number, data: UpdateInversionData): Promise<Inversion | null>;
    delete(id: number): Promise<boolean>;
}

import { DataSource, Repository } from 'typeorm';
import { Cartera } from '../domain/cartera.entity';
import { CuentaCorriente } from '../domain/cuenta-corriente.entity';
import { Inversion } from '../domain/inversion.entity';
import { ICarteraPort, CreateCarteraData, UpdateCarteraData } from '../ports/cartera.port';

export class CarteraRepository implements ICarteraPort {
    private readonly carteraRepo: Repository<Cartera>;
    private readonly cuentaRepo: Repository<CuentaCorriente>;
    private readonly inversionRepo: Repository<Inversion>;

    constructor(dataSource: DataSource) {
        this.carteraRepo = dataSource.getRepository(Cartera);
        this.cuentaRepo = dataSource.getRepository(CuentaCorriente);
        this.inversionRepo = dataSource.getRepository(Inversion);
    }

    async findAll(): Promise<Cartera[]> {
        // cuentasCorrientes e inversiones se cargan automáticamente (eager: true)
        return this.carteraRepo.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<Cartera | null> {
        return this.carteraRepo.findOneBy({ id });
    }

    async create(data: CreateCarteraData): Promise<Cartera> {
        const cartera = this.carteraRepo.create(data);
        return this.carteraRepo.save(cartera);
    }

    async update(id: number, data: UpdateCarteraData): Promise<Cartera | null> {
        const cartera = await this.carteraRepo.findOneBy({ id });
        if (!cartera) return null;

        Object.assign(cartera, data);
        return this.carteraRepo.save(cartera);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.carteraRepo.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async addCuenta(carteraId: number, cuentaId: number): Promise<Cartera | null> {
        const [cartera, cuenta] = await Promise.all([
            this.carteraRepo.findOneBy({ id: carteraId }),
            this.cuentaRepo.findOneBy({ id: cuentaId }),
        ]);
        if (!cartera || !cuenta) return null;

        cuenta.cartera = cartera;
        await this.cuentaRepo.save(cuenta);
        return this.carteraRepo.findOneBy({ id: carteraId });
    }

    async addInversion(carteraId: number, inversionId: number): Promise<Cartera | null> {
        const [cartera, inversion] = await Promise.all([
            this.carteraRepo.findOneBy({ id: carteraId }),
            this.inversionRepo.findOneBy({ id: inversionId }),
        ]);
        if (!cartera || !inversion) return null;

        inversion.cartera = cartera;
        await this.inversionRepo.save(inversion);
        return this.carteraRepo.findOneBy({ id: carteraId });
    }

    async removeCuenta(carteraId: number, cuentaId: number): Promise<Cartera | null> {
        const cuenta = await this.cuentaRepo.findOneBy({ id: cuentaId });
        if (!cuenta || cuenta.cartera?.id !== carteraId) return null;

        cuenta.cartera = null;
        await this.cuentaRepo.save(cuenta);
        return this.carteraRepo.findOneBy({ id: carteraId });
    }

    async removeInversion(carteraId: number, inversionId: number): Promise<Cartera | null> {
        const inversion = await this.inversionRepo.findOneBy({ id: inversionId });
        if (!inversion || inversion.cartera?.id !== carteraId) return null;

        inversion.cartera = null;
        await this.inversionRepo.save(inversion);
        return this.carteraRepo.findOneBy({ id: carteraId });
    }
}

import { DataSource, Repository } from 'typeorm';
import { Inversion } from '../domain/inversion.entity';
import { IInversionPort, CreateInversionData, UpdateInversionData } from '../ports/inversion.port';

export class InversionRepository implements IInversionPort {
    private readonly repository: Repository<Inversion>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Inversion);
    }

    async findAll(): Promise<Inversion[]> {
        return this.repository.find({ order: { createdAt: 'DESC' } });
    }

    async findById(id: number): Promise<Inversion | null> {
        return this.repository.findOneBy({ id });
    }

    async create(data: CreateInversionData): Promise<Inversion> {
        const inversion = this.repository.create(data);
        return this.repository.save(inversion);
    }

    async update(id: number, data: UpdateInversionData): Promise<Inversion | null> {
        const inversion = await this.repository.findOneBy({ id });
        if (!inversion) return null;

        Object.assign(inversion, data);
        return this.repository.save(inversion);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}

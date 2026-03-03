import { DataSource, Repository } from "typeorm";
import { ITagPort } from "../ports/tag.port";
import { Tag } from "../domain/tag.entity";

export class TagRepository implements ITagPort {
    private readonly repository: Repository<Tag>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Tag);
    }

    async getAll(): Promise<Tag[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<Tag> {
        const tag = await this.repository.findOneBy({ id });
        if (!tag) throw new Error(`Tag with id ${id} not found`);
        return tag;
    }

    async getByName(name: string): Promise<Tag> {
        const tag = await this.repository.findOneBy({ name });
        if (!tag) throw new Error(`Tag with name ${name} not found`);
        return tag;
    }

    async create(tag: Tag): Promise<Tag> {
        return this.repository.save(tag);
    }

    async update(tag: Tag): Promise<Tag> {
        return this.repository.save(tag);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
} 
import { Tag } from "../domain/tag.entity";
import { TagRepository } from "../infraestrucuture/tag.repository";

export class TagService {
    constructor(private readonly tagRepository: TagRepository) { }

    async getAll(): Promise<Tag[]> {
        try {
            return this.tagRepository.getAll();
        } catch (error) {
            throw error;
        }
    }

    async getById(id: number): Promise<Tag> {
        try {
            return this.tagRepository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async getByName(name: string): Promise<Tag> {
        try {
            return this.tagRepository.getByName(name);
        } catch (error) {
            throw error;
        }
    }

    async create(tag: Tag): Promise<Tag> {
        try {
            return this.tagRepository.create(tag);
        } catch (error) {
            throw error;
        }
    }

    async update(tag: Tag): Promise<Tag> {
        try {
            return this.tagRepository.update(tag);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.tagRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
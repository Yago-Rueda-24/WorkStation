import { TagService } from "../services/tag.service";
import { Tag } from "../domain/tag.entity";

export class TagController {
    constructor(private readonly tagService: TagService) { }

    async getAllTags(): Promise<Tag[]> {
        try {
            return this.tagService.getAll();
        } catch (error) {
            throw error;
        }
    }

    async getTagById(id: number): Promise<Tag> {
        try {
            return this.tagService.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async getTagByName(name: string): Promise<Tag> {
        try {
            return this.tagService.getByName(name);
        } catch (error) {
            throw error;
        }
    }

    async createTag(tag: Tag): Promise<Tag> {
        try {
            return this.tagService.create(tag);
        } catch (error) {
            throw error;
        }
    }

    async updateTag(tag: Tag): Promise<Tag> {
        try {
            return this.tagService.update(tag);
        } catch (error) {
            throw error;
        }
    }

    async deleteTag(id: number): Promise<void> {
        try {
            await this.tagService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
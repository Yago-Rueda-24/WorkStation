import { TagService } from "../services/tag.service";
import { Tag } from "../domain/tag.entity";

export class TagController {
    constructor(private readonly tagService: TagService) { }

    async handleTagGetAll(): Promise<Tag[]> {
        try {
            return this.tagService.getAll();
        } catch (error) {
            throw error;
        }
    }

    async handleTagGetById(payload: { id: number }): Promise<Tag> {
        try {
            return this.tagService.getById(payload.id);
        } catch (error) {
            throw error;
        }
    }

    async handleTagCreate(payload: { name: string; color: string }): Promise<Tag> {
        try {
            const tag = new Tag();
            tag.name = payload.name;
            tag.color = payload.color;
            return this.tagService.create(tag);
        } catch (error) {
            throw error;
        }
    }

    async handleTagUpdate(payload: { id: number; name?: string; color?: string }): Promise<Tag> {
        try {
            const tag = await this.tagService.getById(payload.id);
            if (payload.name) tag.name = payload.name;
            if (payload.color) tag.color = payload.color;
            return this.tagService.update(tag);
        } catch (error) {
            throw error;
        }
    }

    async handleTagDelete(payload: { id: number }): Promise<void> {
        try {
            await this.tagService.delete(payload.id);
        } catch (error) {
            throw error;
        }
    }
}
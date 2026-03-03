import { Tag } from "../domain/tag.entity";

export interface ITagPort {
    getAll(): Promise<Tag[]>;
    getById(id: number): Promise<Tag>;
    getByName(name: string): Promise<Tag>;
    create(tag: Tag): Promise<Tag>;
    update(tag: Tag): Promise<Tag>;
    delete(id: number): Promise<void>;
}
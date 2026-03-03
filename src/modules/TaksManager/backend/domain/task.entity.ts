import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tag } from './tag.entity';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ default: false })
    completed!: boolean;

    @ManyToOne(() => Tag, (tag) => tag.tasks, { nullable: true, onDelete: 'SET NULL' })
    tag?: Tag | null;

    @Column({ type: 'varchar', default: TaskStatus.PENDING })
    status!: TaskStatus;

    @Column({ type: 'text', nullable: true })
    dueDate!: string | null;

    @CreateDateColumn()
    createdAt!: Date;
}

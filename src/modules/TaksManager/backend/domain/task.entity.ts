import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

    @Column({ type: 'varchar', default: TaskStatus.PENDING })
    status!: TaskStatus;

    @CreateDateColumn()
    createdAt!: Date;
}

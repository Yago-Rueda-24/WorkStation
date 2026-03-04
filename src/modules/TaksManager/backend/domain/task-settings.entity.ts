import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TaskSettings {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    autoDeleteCompletedTasks!: boolean;

    @Column({ default: 30 })
    autoDeleteDaysPassed!: number;
}

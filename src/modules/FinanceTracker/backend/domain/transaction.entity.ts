import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import type { CuentaCorriente } from './cuenta-corriente.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    nombre!: string;

    @Column()
    descripcion!: string;

    @Column()
    valor!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne('CuentaCorriente', 'transacciones', { onDelete: 'CASCADE' })
    cuentaCorriente!: CuentaCorriente;
}
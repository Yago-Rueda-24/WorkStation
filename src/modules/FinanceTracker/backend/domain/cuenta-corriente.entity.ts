import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IFinanceAccount } from './finance-account.interface';
import type { Cartera } from './cartera.entity';
import type { Transaction } from './transaction.entity';

/**
 * Representa una cuenta bancaria corriente o de ahorro del usuario.
 * Implementa IFinanceAccount, por lo que TypeScript obliga a definir `saldo`.
 */
@Entity()
export class CuentaCorriente implements IFinanceAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    /** Nombre descriptivo (ej. "Cuenta nómina BBVA"). */
    @Column()
    nombre!: string;

    /** Saldo actual de la cuenta. */
    @Column({ type: 'real', default: 0 })
    saldo!: number;

    /** IBAN de la cuenta (opcional). */
    @Column({ type: 'varchar', nullable: true })
    iban!: string | null;

    /** Nombre del banco o entidad financiera (opcional). */
    @Column({ type: 'varchar', nullable: true })
    banco!: string | null;

    /** Código de moneda ISO 4217. */
    @Column({ type: 'varchar', default: 'EUR' })
    moneda!: string;

    @CreateDateColumn()
    createdAt!: Date;

    /** Cartera a la que pertenece (opcional). */
    @ManyToOne('Cartera', 'cuentasCorrientes', { nullable: true, onDelete: 'SET NULL' })
    cartera!: Cartera | null;

    /** Transacciones asociadas a esta cuenta corriente. */
    @OneToMany('Transaction', 'cuentaCorriente')
    transacciones!: Transaction[];
}

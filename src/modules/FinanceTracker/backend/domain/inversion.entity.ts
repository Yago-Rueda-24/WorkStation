import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { IFinanceAccount } from './finance-account.interface';
import type { Cartera } from './cartera.entity';

export enum TipoInversion {
    ACCIONES = 'acciones',
    FONDOS   = 'fondos',
    CRIPTO   = 'cripto',
    DEPOSITO = 'deposito',
    OTRO     = 'otro',
}

/**
 * Representa una posición de inversión del usuario.
 * Implementa IFinanceAccount, por lo que `saldo` refleja el valor de mercado actual.
 *
 * La rentabilidad no se almacena — se calcula en tiempo real como:
 *   ((saldo - valorInicial) / valorInicial) * 100
 */
@Entity()
export class Inversion implements IFinanceAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    /** Nombre descriptivo (ej. "Cartera S&P 500", "Bitcoin"). */
    @Column()
    nombre!: string;

    /** Valor de mercado actual de la inversión. */
    @Column({ type: 'real', default: 0 })
    saldo!: number;

    /** Capital inicial invertido. Necesario para calcular la rentabilidad. */
    @Column({ type: 'real', default: 0 })
    valorInicial!: number;

    /** Categoría de la inversión. */
    @Column({ type: 'varchar', default: TipoInversion.OTRO })
    tipo!: TipoInversion;

    /** Fecha de apertura de la posición. */
    @Column({ type: 'datetime', nullable: true })
    fechaInicio!: Date | null;

    /** Código de moneda ISO 4217. */
    @Column({ type: 'varchar', default: 'EUR' })
    moneda!: string;

    @CreateDateColumn()
    createdAt!: Date;

    /** Cartera a la que pertenece (opcional). */
    @ManyToOne('Cartera', 'inversiones', { nullable: true, onDelete: 'SET NULL' })
    cartera!: Cartera | null;

    /**
     * Rentabilidad calculada en porcentaje.
     * No persiste en base de datos — se deriva de saldo y valorInicial.
     */
    get rentabilidad(): number {
        if (this.valorInicial === 0) return 0;
        return ((this.saldo - this.valorInicial) / this.valorInicial) * 100;
    }
}

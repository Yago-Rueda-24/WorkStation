import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { CuentaCorriente } from './cuenta-corriente.entity';
import { Inversion } from './inversion.entity';
import { IFinanceAccount } from './finance-account.interface';

/**
 * Agrupa una colección de cuentas corrientes y/o inversiones.
 *
 * Cada entidad mantiene toda su información propia. Cartera simplemente
 * conoce qué cuentas pertenecen a su grupo mediante dos relaciones @OneToMany.
 *
 * El getter `cuentas` fusiona ambas listas en un único array tipado como
 * IFinanceAccount[], permitiendo operar sobre el grupo de forma uniforme.
 */
@Entity()
export class Cartera {
    @PrimaryGeneratedColumn()
    id!: number;

    /** Nombre descriptivo (ej. "Patrimonio personal", "Ahorro vivienda"). */
    @Column()
    nombre!: string;

    /** Descripción opcional de la cartera. */
    @Column({ type: 'text', nullable: true })
    descripcion!: string | null;

    @OneToMany(() => CuentaCorriente, cc => cc.cartera, { eager: true })
    cuentasCorrientes!: CuentaCorriente[];

    @OneToMany(() => Inversion, inv => inv.cartera, { eager: true })
    inversiones!: Inversion[];

    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Lista unificada de todas las cuentas del grupo.
     * Tipada como IFinanceAccount[] — el denominador común entre ambas entidades.
     */
    get cuentas(): IFinanceAccount[] {
        return [...(this.cuentasCorrientes ?? []), ...(this.inversiones ?? [])];
    }

    /** Saldo total del grupo: suma de saldos de todas las cuentas e inversiones. */
    get saldoTotal(): number {
        const saldoCuentas = (this.cuentasCorrientes || []).reduce((sum, c) => sum + c.saldo, 0);
        const saldoInversiones = (this.inversiones || []).reduce((sum, inv) => sum + inv.valorTotal, 0);
        return saldoCuentas + saldoInversiones;
    }
}

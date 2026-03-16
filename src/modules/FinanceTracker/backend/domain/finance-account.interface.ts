/**
 * Contrato base para cualquier tipo de cuenta financiera del módulo.
 *
 * Toda entidad que represente un instrumento financiero con valor económico
 * debe implementar esta interfaz. El campo `saldo` es el único requisito
 * obligatorio, ya que es el denominador común entre cuentas corrientes,
 * inversiones, préstamos, etc.
 */
export interface IFinanceAccount {
    /** Identificador único de la cuenta. */
    id: number;

    /** Nombre descriptivo dado por el usuario (ej. "Cuenta nómina", "Cartera crypto"). */
    nombre: string;

    /** Saldo actual de la cuenta en la moneda indicada. Campo obligatorio. */
    saldo: number;

    /** Código de moneda ISO 4217 (ej. 'EUR', 'USD'). Por defecto 'EUR'. */
    moneda: string;

    /** Fecha de creación del registro. */
    createdAt: Date;
}

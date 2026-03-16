import { BaseModule } from '../../shared/domain/ports/module.port';
import { AppDataSource } from '../../core/backend/database';

import { CuentaCorrienteRepository } from './backend/infraestrucuture/cuenta-corriente.repository';
import { CuentaCorrienteService } from './backend/services/cuenta-corriente.service';
import { CuentaCorrienteController } from './backend/controllers/cuenta-corriente.controller';

import { InversionRepository } from './backend/infraestrucuture/inversion.repository';
import { InversionService } from './backend/services/inversion.service';
import { InversionController } from './backend/controllers/inversion.controller';

import { CarteraRepository } from './backend/infraestrucuture/cartera.repository';
import { CarteraService } from './backend/services/cartera.service';
import { CarteraController } from './backend/controllers/cartera.controller';

export class FinanceTrackerModule extends BaseModule {
    static readonly description = 'Finance Tracker Module';
    static readonly router = '/finance-tracker';
    static readonly prefix = 'finance-tracker';

    readonly description = FinanceTrackerModule.description;
    readonly router = FinanceTrackerModule.router;
    readonly prefix = FinanceTrackerModule.prefix;

    private readonly cuentaController: CuentaCorrienteController;
    private readonly inversionController: InversionController;
    private readonly carteraController: CarteraController;

    constructor() {
        super();

        const cuentaRepository = new CuentaCorrienteRepository(AppDataSource);
        const cuentaService = new CuentaCorrienteService(cuentaRepository);
        this.cuentaController = new CuentaCorrienteController(cuentaService);

        const inversionRepository = new InversionRepository(AppDataSource);
        const inversionService = new InversionService(inversionRepository);
        this.inversionController = new InversionController(inversionService);

        const carteraRepository = new CarteraRepository(AppDataSource);
        const carteraService = new CarteraService(carteraRepository);
        this.carteraController = new CarteraController(carteraService);
    }

    getHandlers(): Record<string, Function> {
        const handlers: Record<string, Function> = {};

        for (const controller of [this.cuentaController, this.inversionController, this.carteraController]) {
            Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
                .filter(name => name !== 'constructor' && !name.startsWith('serialize'))
                .forEach(name => {
                    handlers[name] = (controller as any)[name].bind(controller);
                });
        }

        return handlers;
    }
}


import { BaseModule } from '../../shared/domain/ports/module.port';

export class TaskManagerModule extends BaseModule {
    readonly prefix = 'taskmanager';

    constructor() {
        super();
    }

    getHandlers(): Record<string, Function> {
        const handlers: Record<string, Function> = {};
        /*
        Object.getOwnPropertyNames(SysInfoController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.controller as any)[name].bind(this.controller);
            });*/
        return handlers;
    }

}
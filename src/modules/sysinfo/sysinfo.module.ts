import { SysInfoController } from './backend/controllers/sysinfo.controller';
import { SysInfoService } from './backend/services/sysinfo.service';
import { SysInfoInfra } from './backend/infraestrucuture/sysinfo.infra';
import { SysInfoEventEmitter } from './backend/infraestrucuture/sysinfo.eventemitter';
import { IEventPort, BaseModule } from '../../shared/domain/ports/module.port';
import { BrowserWindow } from 'electron';

export class SysInfoModule extends BaseModule implements IEventPort {
    static readonly description = 'System Info Module';
    static readonly router = '/sysinfo';
    static readonly prefix = 'sysinfo';

    readonly description = SysInfoModule.description;
    readonly router = SysInfoModule.router;
    readonly prefix = SysInfoModule.prefix;
    controller: SysInfoController;

    constructor() {
        super();
        const infra = new SysInfoInfra();
        const service = new SysInfoService(infra);
        this.controller = new SysInfoController(service);
    }

    getHandlers(): Record<string, Function> {
        const handlers: Record<string, Function> = {};
        Object.getOwnPropertyNames(SysInfoController.prototype)
            .filter(name => name !== 'constructor')
            .forEach(name => {
                handlers[name] = (this.controller as any)[name].bind(this.controller);
            });
        return handlers;
    }

    setupEvents(win: BrowserWindow): void {
        const emitter = new SysInfoEventEmitter();

        emitter.on('updated', (data) => {
            win.webContents.send(`${this.prefix}:updated`, data);
        });

        emitter.on('error', (error) => {
            console.error(`[${this.prefix} Emitter Error]:`, error);
        });

        emitter.start();
    }
}
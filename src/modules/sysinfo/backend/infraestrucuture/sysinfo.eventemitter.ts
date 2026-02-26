import { EventEmitter } from 'events';
import { SysInfoService } from '../services/sysinfo.service';
import { SysInfoEntity } from '../domain/sysinfo.entity'
import { SysInfoInfra } from './sysinfo.infra';

export class SysInfoEventEmitter extends EventEmitter {
    private running = false;
    private readonly interval = 1000;
    private readonly sysInfoService: SysInfoService;

    constructor() {
        super();
        this.sysInfoService = new SysInfoService(new SysInfoInfra());
    }

    async start(): Promise<void> {

        if (this.running) return;
        this.running = true;

        while (this.running) {
            try {
                const snapshot: SysInfoEntity = await this.sysInfoService.getAll();


                this.emit('updated', snapshot);

            } catch (error) {
                this.emit('error', error);
            }

            await this.delay();
        }
    }

    stop(): void {
        this.running = false;
    }

    private delay(): Promise<void> {
        return new Promise(res => setTimeout(res, this.interval));
    }

}
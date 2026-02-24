import { SysInfoService } from '../services/sysinfo.service';
import { SysInfoEntity } from '../domain/sysinfo.entity';

export class SysInfoController {
    private readonly sysInfoService: SysInfoService;

    constructor(sysInfoService: SysInfoService) {
        this.sysInfoService = sysInfoService;
    }

    async handleGetCpuLoad(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getCpuLoad();
    }

    async handleGetMemoryLoad(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getMemoryLoad();
    }

    async handleGetNetworkLoad(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getNetworkLoad();
    }

    async handleGetDiskLoad(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getDiskLoad();
    }

    async handleGetGpuLoad(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getGpuLoad();
    }

    async handleGetAll(): Promise<SysInfoEntity> {
        return await this.sysInfoService.getAll();
    }
}
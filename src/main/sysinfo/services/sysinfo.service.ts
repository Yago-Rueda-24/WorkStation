import { ISysInfoPort } from '../ports/sysinfo.port';
import { SysInfoEntity } from '../domain/sysinfo.entity';

export class SysInfoService {
    private readonly sysInfoPort: ISysInfoPort;

    constructor(sysInfoPort: ISysInfoPort) {
        this.sysInfoPort = sysInfoPort;
    }

    async getCpuLoad(): Promise<SysInfoEntity> {
        const load = await this.sysInfoPort.getCpuLoad();
        const sysInfo = new SysInfoEntity();
        sysInfo.setCpuLoad(load);
        return sysInfo;
    }
    async getGpuLoad(): Promise<SysInfoEntity> {
        const load = await this.sysInfoPort.getGPULoad();
        const sysInfo = new SysInfoEntity();
        sysInfo.setGpuLoad(load ?? 0);
        return sysInfo;
    }

    async getMemoryLoad(): Promise<SysInfoEntity> {
        const { active, total } = await this.sysInfoPort.getMemoryData();
        const load = (active / total) * 100;
        const sysInfo = new SysInfoEntity();
        sysInfo.setMemoryLoad(load);
        return sysInfo;
    }

    async getNetworkLoad(): Promise<SysInfoEntity> {
        const load = await this.sysInfoPort.getNetworkLoad();
        const sysInfo = new SysInfoEntity();
        sysInfo.setNetworkLoad(load);
        return sysInfo;
    }

    async getDiskLoad(): Promise<SysInfoEntity> {
        const load = await this.sysInfoPort.getDiskLoad();
        const sysInfo = new SysInfoEntity();
        sysInfo.setDiskLoad(load);
        return sysInfo;
    }

    async getAll(): Promise<SysInfoEntity> {
        const [cpu, mem, net, disk, gpu] = await Promise.all([
            this.sysInfoPort.getCpuLoad(),
            this.sysInfoPort.getMemoryData(),
            this.sysInfoPort.getNetworkLoad(),
            this.sysInfoPort.getDiskLoad(),
            this.sysInfoPort.getGPULoad()
        ]);

        const sysInfo = new SysInfoEntity();
        sysInfo.setCpuLoad(cpu);
        sysInfo.setMemoryLoad((mem.active / mem.total) * 100);
        sysInfo.setNetworkLoad(net);
        sysInfo.setDiskLoad(disk);
        sysInfo.setGpuLoad(gpu ?? 0);
        return sysInfo;
    }
}

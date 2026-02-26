export class SysInfoEntity {
    private cpuLoad: number;
    private cpus: number[];
    private memoryLoad: number;
    private networkLoad: number;
    private diskLoad: number;
    private gpuLoad: number;

    constructor() {
        this.cpuLoad = 0;
        this.cpus = [];
        this.memoryLoad = 0;
        this.networkLoad = 0;
        this.diskLoad = 0;
        this.gpuLoad = 0;
    }

    getGpuLoad(): number {
        return this.gpuLoad;
    }

    setGpuLoad(gpuLoad: number): void {
        this.gpuLoad = Math.round(gpuLoad * 100) / 100;
    }

    getCpuLoad(): number {
        return this.cpuLoad;
    }

    getCpus(): number[] {
        return this.cpus;
    }

    setCpuLoad(cpuLoad: number): void {
        this.cpuLoad = Math.round(cpuLoad * 100) / 100;
    }

    setCpus(cpus: number[]): void {
        this.cpus = cpus.map(load => Math.round(load * 100) / 100);
    }

    getMemoryLoad(): number {
        return this.memoryLoad;
    }

    setMemoryLoad(memoryLoad: number): void {
        this.memoryLoad = Math.round(memoryLoad * 100) / 100;
    }

    getNetworkLoad(): number {
        return this.networkLoad;
    }

    setNetworkLoad(networkLoad: number): void {
        this.networkLoad = Math.round(networkLoad * 100) / 100;
    }

    getDiskLoad(): number {
        return this.diskLoad;
    }

    setDiskLoad(diskLoad: number): void {
        this.diskLoad = Math.round(diskLoad * 100) / 100;
    }
    toJSON() {
        return {
            cpuLoad: this.cpuLoad,
            cpus: this.cpus,
            memoryLoad: this.memoryLoad,
            networkLoad: this.networkLoad,
            diskLoad: this.diskLoad,
            gpuLoad: this.gpuLoad,
        };
    }

    static fromPlain(data: any): SysInfoEntity {
        const entity = new SysInfoEntity();
        if (data.cpuLoad !== undefined) entity.setCpuLoad(data.cpuLoad);
        if (data.cpus !== undefined) entity.setCpus(data.cpus);
        if (data.memoryLoad !== undefined) entity.setMemoryLoad(data.memoryLoad);
        if (data.networkLoad !== undefined) entity.setNetworkLoad(data.networkLoad);
        if (data.diskLoad !== undefined) entity.setDiskLoad(data.diskLoad);
        if (data.gpuLoad !== undefined) entity.setGpuLoad(data.gpuLoad);
        return entity;
    }
}

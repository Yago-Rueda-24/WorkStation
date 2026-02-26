import si from 'systeminformation';
import { ISysInfoPort } from '../ports/sysinfo.port';


export class SysInfoInfra implements ISysInfoPort {
    async getGPULoad(): Promise<number | undefined> {
        const data = await si.graphics();
        return data.controllers?.[0]?.utilizationGpu;
    }
    async getMemoryData(): Promise<{ active: number, total: number }> {
        const data = await si.mem();
        return { active: data.active, total: data.total };
    }

    async getNetworkLoad(): Promise<number> {
        const stats = await si.networkStats();
        // We sum rx_sec and tx_sec from all interfaces and normalize it to a "load" value.
        // Since we don't have max bandwith easily, we'll just return the KB/s value for now.
        const totalKBps = stats ? stats.reduce((acc, curr) => acc + (curr.rx_sec + curr.tx_sec) / 1024, 0) : 0;
        return totalKBps;
    }

    async getDiskLoad(): Promise<number> {
        const stats = await si.disksIO();
        // Sum of read and write throughput in KB/s
        const totalKBps = stats ? ((stats.rIO_sec || 0) + (stats.wIO_sec || 0)) / 1024 : 0;
        return totalKBps;
    }

    async getCpuLoad(): Promise<number> {
        const data = await si.currentLoad();
        return data.currentLoad;
    }
}
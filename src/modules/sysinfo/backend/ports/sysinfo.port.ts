
export interface ISysInfoPort {
    getCpuLoad(): Promise<number>;
    getMemoryData(): Promise<{ active: number, total: number }>;
    getNetworkLoad(): Promise<number>;
    getDiskLoad(): Promise<number>;
    getGPULoad(): Promise<number | undefined>;
}

import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...
})

// --------- Expose domain API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
    sysinfo: {
        handleGetCpuLoad: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetCpuLoad', payload),
        handleGetMemoryLoad: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetMemoryLoad', payload),
        handleGetNetworkLoad: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetNetworkLoad', payload),
        handleGetDiskLoad: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetDiskLoad', payload),
        handleGetGpuLoad: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetGpuLoad', payload),
        handleGetAll: (payload?: any) => ipcRenderer.invoke('sysinfo:handleGetAll', payload),
        handleOnUpdated: (callback: (data: any) => void) => {
            const listener = (_event: any, data: any) => callback(data);
            ipcRenderer.on('sysinfo:updated', listener);
            return () => ipcRenderer.removeListener('sysinfo:updated', listener);
        }
    },
    taskmanager: {
        handleGetAll: (payload?: any) => ipcRenderer.invoke('taskmanager:handleGetAll', payload),
        handleGetById: (payload?: any) => ipcRenderer.invoke('taskmanager:handleGetById', payload),
        handleCreate: (payload?: any) => ipcRenderer.invoke('taskmanager:handleCreate', payload),
        handleUpdate: (payload?: any) => ipcRenderer.invoke('taskmanager:handleUpdate', payload),
        handleDelete: (payload?: any) => ipcRenderer.invoke('taskmanager:handleDelete', payload),
    }
});

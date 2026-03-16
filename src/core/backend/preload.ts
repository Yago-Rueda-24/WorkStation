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
        handleDeleteCompletedTasks: () => ipcRenderer.invoke('taskmanager:handleDeleteCompletedTasks'),
        // Tag handlers
        handleTagGetAll: (payload?: any) => ipcRenderer.invoke('taskmanager:handleTagGetAll', payload),
        handleTagCreate: (payload?: any) => ipcRenderer.invoke('taskmanager:handleTagCreate', payload),
        handleTagUpdate: (payload?: any) => ipcRenderer.invoke('taskmanager:handleTagUpdate', payload),
        handleTagDelete: (payload?: any) => ipcRenderer.invoke('taskmanager:handleTagDelete', payload),
        // Settings handlers
        handleGetSettings: () => ipcRenderer.invoke('taskmanager:handleGetSettings'),
        handleUpdateSettings: (payload?: any) => ipcRenderer.invoke('taskmanager:handleUpdateSettings', payload),
    },
    'finance-tracker': {
        // CuentaCorriente
        handleCuentaGetAll: () => ipcRenderer.invoke('finance-tracker:handleCuentaGetAll'),
        handleCuentaGetById: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCuentaGetById', payload),
        handleCuentaCreate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCuentaCreate', payload),
        handleCuentaUpdate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCuentaUpdate', payload),
        handleCuentaDelete: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCuentaDelete', payload),
        handleCuentaGetTotalSaldo: () => ipcRenderer.invoke('finance-tracker:handleCuentaGetTotalSaldo'),
        // Inversion
        handleInversionGetAll: () => ipcRenderer.invoke('finance-tracker:handleInversionGetAll'),
        handleInversionGetById: (payload: any) => ipcRenderer.invoke('finance-tracker:handleInversionGetById', payload),
        handleInversionCreate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleInversionCreate', payload),
        handleInversionUpdate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleInversionUpdate', payload),
        handleInversionDelete: (payload: any) => ipcRenderer.invoke('finance-tracker:handleInversionDelete', payload),
        handleInversionGetResumen: () => ipcRenderer.invoke('finance-tracker:handleInversionGetResumen'),
        // Cartera
        handleCarteraGetAll: () => ipcRenderer.invoke('finance-tracker:handleCarteraGetAll'),
        handleCarteraGetById: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraGetById', payload),
        handleCarteraCreate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraCreate', payload),
        handleCarteraUpdate: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraUpdate', payload),
        handleCarteraDelete: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraDelete', payload),
        handleCarteraAddCuenta: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraAddCuenta', payload),
        handleCarteraAddInversion: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraAddInversion', payload),
        handleCarteraRemoveCuenta: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraRemoveCuenta', payload),
        handleCarteraRemoveInversion: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraRemoveInversion', payload),
        handleCarteraGetSaldoTotal: (payload: any) => ipcRenderer.invoke('finance-tracker:handleCarteraGetSaldoTotal', payload),
    },
    updater: {
        // Manual actions
        checkForUpdates: () => ipcRenderer.invoke('updater:check'),
        downloadUpdate: () => ipcRenderer.invoke('updater:download'),
        quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
        // Event listeners
        onCheckingForUpdate: (callback: () => void) => {
            const listener = () => callback();
            ipcRenderer.on('updater:checking-for-update', listener);
            return () => ipcRenderer.removeListener('updater:checking-for-update', listener);
        },
        onUpdateAvailable: (callback: (info: any) => void) => {
            const listener = (_event: any, info: any) => callback(info);
            ipcRenderer.on('updater:update-available', listener);
            return () => ipcRenderer.removeListener('updater:update-available', listener);
        },
        onUpdateNotAvailable: (callback: (info: any) => void) => {
            const listener = (_event: any, info: any) => callback(info);
            ipcRenderer.on('updater:update-not-available', listener);
            return () => ipcRenderer.removeListener('updater:update-not-available', listener);
        },
        onDownloadProgress: (callback: (progress: any) => void) => {
            const listener = (_event: any, progress: any) => callback(progress);
            ipcRenderer.on('updater:download-progress', listener);
            return () => ipcRenderer.removeListener('updater:download-progress', listener);
        },
        onUpdateDownloaded: (callback: (info: any) => void) => {
            const listener = (_event: any, info: any) => callback(info);
            ipcRenderer.on('updater:update-downloaded', listener);
            return () => ipcRenderer.removeListener('updater:update-downloaded', listener);
        },
        onError: (callback: (message: string) => void) => {
            const listener = (_event: any, message: string) => callback(message);
            ipcRenderer.on('updater:error', listener);
            return () => ipcRenderer.removeListener('updater:error', listener);
        },
    },
});

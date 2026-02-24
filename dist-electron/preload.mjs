"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  sysinfo: {
    handleGetCpuLoad: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetCpuLoad", payload),
    handleGetMemoryLoad: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetMemoryLoad", payload),
    handleGetNetworkLoad: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetNetworkLoad", payload),
    handleGetDiskLoad: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetDiskLoad", payload),
    handleGetGpuLoad: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetGpuLoad", payload),
    handleGetAll: (payload) => electron.ipcRenderer.invoke("sysinfo:handleGetAll", payload),
    handleOnUpdated: (callback) => {
      const listener = (_event, data) => callback(data);
      electron.ipcRenderer.on("sysinfo:updated", listener);
      return () => electron.ipcRenderer.removeListener("sysinfo:updated", listener);
    }
  }
});

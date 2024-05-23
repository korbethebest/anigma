import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  },
  getDocumentsPath: () => ipcRenderer.invoke("get-documents-path"),
  readDirectory: (dirPath: string) =>
    ipcRenderer.invoke("read-directory", dirPath),
  selectDirectory: () => ipcRenderer.invoke("select-directory"),
  getName: (filePath: string) => ipcRenderer.invoke("get-name", filePath),
  getFileIcon: (filePath: string) =>
    ipcRenderer.invoke("get-file-icon", filePath),
});

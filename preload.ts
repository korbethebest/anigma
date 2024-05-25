import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

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
  readFile: (filePath: string) => ipcRenderer.invoke("read-file", filePath),
  openImageWindow: (imageData: string) =>
    ipcRenderer.send("open-image-window", imageData),
  openVideoWindow: (videoData: string): void =>
    ipcRenderer.send("open-video-window", videoData),
  openAudioWindow: (audioData: string): void =>
    ipcRenderer.send("open-audio-window", audioData),
  openTextWindow: (filePath: string) =>
    ipcRenderer.send("open-text-window", filePath),
});

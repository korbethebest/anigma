export {};

declare global {
  interface ElectronAPI {
    ipcRenderer: {
      send: (channel: string, data: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
    };
    getDocumentsPath: () => Promise<string>;
    readDirectory: (
      dirPath: string
    ) => Promise<{ files: string[]; directories: string[] }>;
    selectDirectory: () => Promise<string | null>;
    getName: (filePath: string) => Promise<string>;
    getFileIcon: (filePath: string) => Promise<string>;
    readFile: (filePath: string) => Promise<any>;
    openImageWindow: (imageData: string) => void;
    openVideoWindow: (videoData: string) => void;
    openAudioWindow: (audioData: string) => void;
    openTextWindow: (filePath: string) => void;
  }
  interface Window {
    electron: ElectronAPI;
  }
}

export interface FileInfo {
  name: string;
  path: string;
  icon: string;
}

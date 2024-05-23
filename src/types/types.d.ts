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
  }
  interface Window {
    electron: ElectronAPI;
  }
}

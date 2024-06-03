export {};

declare global {
  interface ElectronAPI {
    ipcRenderer: {
      send: (channel: string, data: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
    };
    getSeparator: () => Promise<string>;
    getDocumentsPath: () => Promise<string>;
    readDirectory: (
      dirPath: string
    ) => Promise<{ files: Info[]; directories: Info[] }>;
    selectDirectory: () => Promise<string | null>;
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

export interface Info {
  name: string;
  path: string;
  icon: string;
  size: number;
  dateModified: Date;
  dateCreated: Date;
  extension: string;
}

export type Criteria = Omit<Info, "path" | "icon">;

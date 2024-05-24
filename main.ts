import { app, BrowserWindow, ipcMain, dialog, nativeImage } from "electron";
import * as path from "path";
import * as os from "os";
import * as url from "url";
import * as fs from "fs";

const BASE_URL = "http://localhost:5173";
const env = process.env.NODE_ENV || "development";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (env === "development") {
    mainWindow.loadURL(BASE_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "./index.html")); //
  }
  mainWindow.on("closed", () => (mainWindow = null));
}
app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow == null) {
    createMainWindow();
  }
});

ipcMain.handle("get-documents-path", () => {
  return path.join(os.homedir(), "Documents");
});

ipcMain.handle("read-directory", async (event, dirPath) => {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const files: string[] = [];
    const directories: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isFile()) {
        files.push(entryPath);
      } else if (entry.isDirectory()) {
        directories.push(entryPath);
      }
    }

    return { files, directories };
  } catch (error) {
    console.error("Error reading directory:", error);
  }
});

ipcMain.handle("select-directory", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle("get-name", async (event, filePath) => {
  const name = await path.basename(filePath);
  return name;
});

ipcMain.handle("get-file-icon", async (event, filePath) => {
  const ext = await path.extname(filePath).toLowerCase();
  let defaultIconPath = "/file-regular.png";
  const audioExtensions = [".mp3", ".wav", ".aac", ".flac"];
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mkv",
    ".mov",
    ".wmv",
    ".flv",
    ".webm",
  ];
  const imageExtensions = [
    ".jpeg",
    ".jpg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];

  if (ext === ".txt") {
    defaultIconPath = "/file-lines-regular.png";
  } else if (ext === ".pdf") {
    defaultIconPath = "/file-pdf-regular.png";
  } else if (audioExtensions.includes(ext)) {
    defaultIconPath = "/file-audio-regular.png";
  } else if (videoExtensions.includes(ext)) {
    defaultIconPath = "/file-video-regular.png";
  } else if (imageExtensions.includes(ext)) {
    defaultIconPath = "/file-image-regular.png";
  }
  return defaultIconPath;
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "base64");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

ipcMain.on("open-image-window", (event, imageData) => {
  const imageWindow = new BrowserWindow({
    width: 1000,
    height: 750,
  });

  imageWindow.loadURL(`data:text/html;charset=utf-8,
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: black;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="data:image/png;base64,${imageData}" />
      </body>
    </html>`);
});

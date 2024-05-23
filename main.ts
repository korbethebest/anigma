import { app, BrowserWindow, ipcMain, dialog } from "electron";
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
  return fs.promises.readdir(dirPath);
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

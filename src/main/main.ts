import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { dirname, join, sep, extname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { promises } from "node:fs";
import { Info } from "../types/types";

const BASE_URL = "http://localhost:5173";
const env = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, "preload.mjs"),
    },
  });

  if (env.NODE_DEV === "development") {
    mainWindow.loadURL(BASE_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "./index.html")); //
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

ipcMain.handle("get-separator", async () => {
  return sep;
});

ipcMain.handle("get-documents-path", () => {
  return join(homedir(), "Documents");
});

const getFileIcon = async (path: string) => {
  const ext = await extname(path).toLowerCase();
  let defaultIconPath = "./File.png";
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
    defaultIconPath = "./FileText.png";
  } else if (audioExtensions.includes(ext)) {
    defaultIconPath = "./FileAudio.png";
  } else if (videoExtensions.includes(ext)) {
    defaultIconPath = "./FileVideo.png";
  } else if (imageExtensions.includes(ext)) {
    defaultIconPath = "./FileImage.png";
  }
  return defaultIconPath;
};

ipcMain.handle("read-directory", async (_, dirPath) => {
  try {
    const entries = await promises.readdir(dirPath, { withFileTypes: true });

    if (!entries.length) return { files: [], directories: [] };

    const files: Info[] = [];
    const directories: Info[] = [];
    for (const entry of entries) {
      const entryPath = join(dirPath, entry.name);
      const entryStat = await promises.stat(entryPath);
      if (entry.isFile()) {
        files.push({
          name: entry.name,
          path: entryPath,
          icon: await getFileIcon(entryPath),
          size: entryStat.size,
          dateModified: entryStat.mtime,
          dateCreated: entryStat.birthtime,
          extension: extname(entryPath),
        });
      } else if (entry.isDirectory()) {
        directories.push({
          name: entry.name,
          path: entryPath,
          icon: "./public/FolderSimple.png",
          size: entryStat.size,
          dateModified: entryStat.mtime,
          dateCreated: entryStat.birthtime,
          extension: extname(entryPath),
        });
      }
    }

    return { files: files, directories: directories };
  } catch (error) {
    console.error("Error reading directory:", error);
    return { files: [], directories: [] };
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

ipcMain.handle("read-file", async (_, filePath) => {
  try {
    const data = await promises.readFile(filePath, "base64");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

function checkFileSize(base64Data: string) {
  const base64Length = base64Data.length;
  const padding = base64Data.endsWith("==")
    ? 2
    : base64Data.endsWith("=")
    ? 1
    : 0;
  const byteSize = (base64Length * 3) / 4 - padding;

  const maxByteSize = 2 * 1024 * 1024;

  if (byteSize > maxByteSize) {
    return false;
  } else return true;
}

ipcMain.on("open-image-window", (_, imageData) => {
  const isReadable = checkFileSize(imageData);
  if (!isReadable) {
    dialog.showMessageBox({
      type: "warning",
      buttons: ["OK"],
      title: "File Size Warning",
      message:
        "The image file is too large to open. Please select a file smaller than 2MB.",
    });
    return;
  }

  const imageWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
    },
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

ipcMain.on("open-video-window", (_, videoData) => {
  const isReadable = checkFileSize(videoData);
  if (!isReadable) {
    dialog.showMessageBox({
      type: "warning",
      buttons: ["OK"],
      title: "File Size Warning",
      message:
        "The video file is too large to open. Please select a file smaller than 2MB.",
    });
    return;
  }

  const videoWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  videoWindow.loadURL(`data:text/html;charset=utf-8,
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
          video {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <video id="videoElement" autoplay controls>
          Your browser does not support the video tag.
        </video>
        <script>
          function base64ToBlob(base64, mime) {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], {type: mime});
          }

          const base64String = "${videoData}";
          const mimeType = "video/mp4";
          const blob = base64ToBlob(base64String, mimeType);
          const blobURL = URL.createObjectURL(blob);
          const videoElement = document.getElementById('videoElement');
          videoElement.src = blobURL;
        </script>
      </body>
    </html>`);
});

ipcMain.on("open-audio-window", (_, audioData) => {
  const isReadable = checkFileSize(audioData);
  if (!isReadable) {
    dialog.showMessageBox({
      type: "warning",
      buttons: ["OK"],
      title: "File Size Warning",
      message:
        "The audio file is too large to open. Please select a file smaller than 2MB.",
    });
    return;
  }

  const audioWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  audioWindow.loadURL(`data:text/html;charset=utf-8,
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
          audio {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <audio controls>
          <source src="data:audio/mp3;base64,${audioData}" type="audio/mp3">
          Your browser does not support the audio tag.
        </audio>
      </body>
    </html>`);
});

ipcMain.on("open-text-window", async (_, filePath) => {
  try {
    const textContent = await promises.readFile(filePath, "utf-8");

    const textWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    textWindow.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head>
          <style>
            body, html {
              margin: 0;
              padding: 20px;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: white;
              font-family: Arial, sans-serif;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre id="textContent">${textContent}</pre>
        </body>
      </html>`);
  } catch (error) {
    dialog.showErrorBox("File Read Error", "Failed to read the text file.");
    console.error(error);
  }
});

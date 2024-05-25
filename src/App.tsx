import { useState } from "react";
import Header from "./components/Header";
import { FileInfo } from "./types/types";
import style from "./App.module.css";

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [directories, setDirectories] = useState<string[]>([]);

  const handleDirectoryChange = (
    newFiles: FileInfo[],
    newDirectories: string[]
  ) => {
    setFiles(newFiles);
    setDirectories(newDirectories);
  };

  const checkExtension = (filePath: string) => {
    const readableExtensions = {
      image: [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      video: [".mp4", ".webm"],
      audio: [".mp3", ".wav"],
      text: [".txt"],
    };

    for (const [type, extensions] of Object.entries(readableExtensions)) {
      if (extensions.some((ext) => filePath.endsWith(ext))) {
        return type;
      }
    }

    return null;
  };

  const handleFileDoubleClick = async (filePath: string) => {
    const fileType = checkExtension(filePath);
    if (!fileType) {
      alert(`Failed to read file: ${filePath}!`);
      return;
    }

    if (fileType === "text") {
      window.electron.openTextWindow(filePath);
    } else {
      const data = await window.electron.readFile(filePath);
      fileType === "image"
        ? window.electron.openImageWindow(data)
        : fileType === "video"
        ? window.electron.openVideoWindow(data)
        : window.electron.openAudioWindow(data);
    }
  };

  return (
    <>
      <Header onDirectoryChange={handleDirectoryChange} />
      <main className={style.main}>
        {(files.length || directories.length) && (
          <div className={style.gap20}>
            <div>
              <h3>Directories:</h3>
              <div className={style.container}>
                {directories.map((directory, index) => (
                  <div key={index} className={style.row}>
                    <img
                      src="/folder-regular.png"
                      alt={directory}
                      className={style.icon}
                    />
                    {directory}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3>Files:</h3>
              <div className={style.container}>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={style.row}
                    onDoubleClick={() => handleFileDoubleClick(file.path)}
                  >
                    <img
                      src={file.icon}
                      alt={file.name}
                      className={style.icon}
                    />
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;

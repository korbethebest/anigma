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

  const handleFileDoubleClick = async (filePath: string) => {
    const readableImageExtensionCandidates = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
    ];
    let isReadable = false;
    for (const candidate of readableImageExtensionCandidates) {
      if (filePath.endsWith(candidate)) {
        isReadable = true;
      }
    }
    if (!isReadable) {
      alert(`Failed to read file: ${filePath}!`);
      return;
    }

    const data = await window.electron.readFile(filePath);
    window.electron.openImageWindow(data);
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

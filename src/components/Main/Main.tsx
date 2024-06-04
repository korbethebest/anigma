import { useState, useEffect } from "react";
import { Info } from "../../types/types";
import { checkExtension } from "../../utils/utils";
import style from "./Main.module.css";

interface MainProps {
  currentDirectory: string;
  files: Info[];
  directories: Info[];
  setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<Info[]>>;
  setDirectories: React.Dispatch<React.SetStateAction<Info[]>>;
}

export default function Main({
  currentDirectory,
  files,
  directories,
  setCurrentDirectory,
  setFiles,
  setDirectories,
}: MainProps) {
  const [loading, setLoading] = useState(true);

  const displayFilesAndDirectories = async (path: string) => {
    const result = await window.electron.readDirectory(path);
    if (!result) return;
    const { files, directories } = result;
    setFiles(files);
    setDirectories(directories);
  };

  useEffect(() => {
    setLoading(true);
    const displayCurrentDirectory = async () => {
      await displayFilesAndDirectories(currentDirectory);
    };
    displayCurrentDirectory();
    setLoading(false);
  }, [currentDirectory]);

  const handleDirectoryDoubleClick = async (directoryPath: string) => {
    const result = await window.electron.readDirectory(directoryPath);
    if (!result) return;
    setCurrentDirectory(directoryPath);
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
    <main className={style.main}>
      {loading ? (
        <div className={style.title}>Loading...</div>
      ) : (
        <>
          {files.length || directories.length ? (
            <div className={style.gap60}>
              <div>
                <div className={style.title}>Directories:</div>
                <div className={style.container}>
                  {directories.map((directory, index) => (
                    <div
                      key={index}
                      className={style.row}
                      onDoubleClick={() =>
                        handleDirectoryDoubleClick(directory.path)
                      }
                      data-testid="directory"
                    >
                      <img
                        src="./FolderSimple.png"
                        alt={directory.name}
                        className={style.icon}
                      />
                      {directory.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className={style.title}>Files:</div>
                <div className={style.container}>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className={style.row}
                      onDoubleClick={() => handleFileDoubleClick(file.path)}
                      data-testid="file"
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
          ) : (
            <div className={style.title}>
              Neither file nor subdirectory is found!
            </div>
          )}
        </>
      )}
    </main>
  );
}

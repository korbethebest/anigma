import { useEffect } from "react";
import { DirectoryInfo, FileInfo } from "../../types/types";
import { checkExtension } from "../../utils/utils";
import style from "./Main.module.css";

interface MainProps {
  currentDirectory: string;
  files: FileInfo[];
  directories: DirectoryInfo[];
  setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  setDirectories: React.Dispatch<React.SetStateAction<DirectoryInfo[]>>;
}

export default function Main({
  currentDirectory,
  files,
  directories,
  setCurrentDirectory,
  setFiles,
  setDirectories,
}: MainProps) {
  const displayFilesAndDirectories = async (path: string) => {
    const result = await window.electron.readDirectory(path);
    if (!result) return;
    const { files: fetchedFiles, directories: fetchedDirectories } = result;
    let filesWithName: FileInfo[] = [];
    let directoriesWithName: DirectoryInfo[] = [];
    if (fetchedFiles) {
      filesWithName = await Promise.all(
        fetchedFiles.map(async (file) => {
          const fileName = await window.electron.getName(file);
          const fileIcon = await window.electron.getFileIcon(file);
          return { name: fileName, path: file, icon: fileIcon };
        })
      );
    }
    if (fetchedDirectories) {
      directoriesWithName = await Promise.all(
        fetchedDirectories.map(async (directory) => {
          const directoryName = await window.electron.getName(directory);
          return { name: directoryName, path: directory };
        })
      );
    }
    setFiles(filesWithName);
    setDirectories(directoriesWithName);
  };

  useEffect(() => {
    const displayCurrentDirectory = async () => {
      await displayFilesAndDirectories(currentDirectory);
    };
    displayCurrentDirectory();
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
      {(files.length || directories.length) && (
        <div className={style.gap20}>
          <div>
            <h3>Directories:</h3>
            <div className={style.container}>
              {directories.map((directory, index) => (
                <div
                  key={index}
                  className={style.row}
                  onDoubleClick={() =>
                    handleDirectoryDoubleClick(directory.path)
                  }
                >
                  <img
                    src="./folder-regular.png"
                    alt={directory.name}
                    className={style.icon}
                  />
                  {directory.name}
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
                  <img src={file.icon} alt={file.name} className={style.icon} />
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

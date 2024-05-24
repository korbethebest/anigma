import { useEffect, useState } from "react";
import style from "./Header.module.css";
import { FileInfo } from "../types/types";

interface HeaderProps {
  onDirectoryChange: (files: FileInfo[], directories: string[]) => void;
}

export default function Header({ onDirectoryChange }: HeaderProps) {
  const [, setRootDirectoryPath] = useState("");
  const [displayDirectoryPath, setDisplayDirectoryPath] = useState("");

  useEffect(() => {
    const fetchDocumentsPath = async () => {
      const documentsPath = await window.electron.getDocumentsPath();
      setRootDirectoryPath(documentsPath);
      setDisplayDirectoryPath(documentsPath);
      const { files: fetchedFiles, directories: fetchedDirectories } =
        await window.electron.readDirectory(documentsPath);
      const filesWithName = await Promise.all(
        fetchedFiles.map(async (file) => {
          const fileName = await window.electron.getName(file);
          const fileIcon = await window.electron.getFileIcon(file);
          return { name: fileName, path: file, icon: fileIcon };
        })
      );
      const directoriesWithName = await Promise.all(
        fetchedDirectories.map(async (directory) => {
          const directoryName = await window.electron.getName(directory);
          return directoryName;
        })
      );

      onDirectoryChange(filesWithName, directoriesWithName);
    };
    fetchDocumentsPath();
  }, []);

  const handleSelectDirectory = async () => {
    const selectedPath = await window.electron.selectDirectory();
    if (selectedPath) {
      setRootDirectoryPath(selectedPath);
      setDisplayDirectoryPath(selectedPath);
      const { files: fetchedFiles, directories: fetchedDirectories } =
        await window.electron.readDirectory(selectedPath);
      const filesWithName = await Promise.all(
        fetchedFiles.map(async (file) => {
          const fileName = await window.electron.getName(file);
          const fileIcon = await window.electron.getFileIcon(file);
          return { name: fileName, path: file, icon: fileIcon };
        })
      );
      const directoriesWithName = await Promise.all(
        fetchedDirectories.map(async (directory) => {
          const directoryName = await window.electron.getName(directory);
          return directoryName;
        })
      );

      onDirectoryChange(filesWithName, directoriesWithName);
    }
  };

  return (
    <div className={style.header}>
      <div className={style.icon}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </div>
      <div>{displayDirectoryPath || "NOT SELECTED"}</div>
      <div className={style.icon} onClick={handleSelectDirectory}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import style from "./Header.module.css";

interface HeaderProps {
  onDirectoryChange: (directory: string) => void;
  currentDirectory: string;
}

export default function Header({
  onDirectoryChange,
  currentDirectory,
}: HeaderProps) {
  const [rootDirectoryPath, setRootDirectoryPath] = useState("");
  const [displayDirectoryPath, setDisplayDirectoryPath] = useState("");

  useEffect(() => {
    const setDocumentsPathAsInitialRootDirectory = async () => {
      const documentsPath = await window.electron.getDocumentsPath();
      setRootDirectoryPath(documentsPath);
      onDirectoryChange(documentsPath);
    };
    setDocumentsPathAsInitialRootDirectory();
  }, []);

  useEffect(() => {
    setDisplayDirectoryPath(currentDirectory);
  }, [currentDirectory]);

  const handleSelectDirectory = async () => {
    const selectedPath = await window.electron.selectDirectory();
    if (selectedPath) {
      setRootDirectoryPath(selectedPath);
      onDirectoryChange(selectedPath);
    }
  };

  const handleGoBack = async () => {
    const separator = await window.electron.getSeparator();
    const parentDirectory = displayDirectoryPath.substring(
      0,
      currentDirectory.lastIndexOf(separator)
    );
    if (parentDirectory.startsWith(rootDirectoryPath)) {
      onDirectoryChange(parentDirectory);
    }
  };

  return (
    <div className={style.header}>
      {rootDirectoryPath === displayDirectoryPath ? (
        <div className={style.blank} />
      ) : (
        <div
          className={style.icon}
          onClick={handleGoBack}
          data-testid="go-back"
        >
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </div>
      )}
      <div className={style.title}>
        <h1>{displayDirectoryPath || "NOT SELECTED"}</h1>
      </div>
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

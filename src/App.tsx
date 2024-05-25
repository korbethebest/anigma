import { useState } from "react";
import { FileInfo, DirectoryInfo } from "./types/types";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";

function App() {
  const [currentDirectory, setCurrentDirectory] = useState("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);

  const handleCurrentDirectoryChange = (directory: string) => {
    setCurrentDirectory(directory);
  };

  return (
    <>
      <Header
        onDirectoryChange={handleCurrentDirectoryChange}
        currentDirectory={currentDirectory || "Loading..."}
      />
      <Main
        currentDirectory={currentDirectory}
        files={files}
        directories={directories}
        setCurrentDirectory={setCurrentDirectory}
        setFiles={setFiles}
        setDirectories={setDirectories}
      />
    </>
  );
}

export default App;

import { useState } from "react";
import { FileInfo, DirectoryInfo } from "./types/types";
import Header from "./components/Header/Header";
import FilterAndSort from "./components/FilterAndSort/FilterAndSort";
import Main from "./components/Main/Main";

function App() {
  const [currentDirectory, setCurrentDirectory] = useState("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
  const [searchTarget, setSearchTarget] = useState("");

  const handleCurrentDirectoryChange = (directory: string) => {
    setCurrentDirectory(directory);
  };

  const filteredFiles = searchTarget.length
    ? files.filter((file) =>
        file.name
          .trim()
          .toLowerCase()
          .normalize()
          .includes(searchTarget.trim().toLowerCase().normalize())
      )
    : files;
  const filteredDirectories = searchTarget.length
    ? directories.filter((directory) =>
        directory.name
          .trim()
          .toLowerCase()
          .normalize()
          .includes(searchTarget.trim().toLowerCase().normalize())
      )
    : directories;

  return (
    <>
      <Header
        onDirectoryChange={handleCurrentDirectoryChange}
        currentDirectory={currentDirectory || "Loading..."}
      />
      <FilterAndSort
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
      />
      <Main
        currentDirectory={currentDirectory}
        files={filteredFiles}
        directories={filteredDirectories}
        setCurrentDirectory={setCurrentDirectory}
        setFiles={setFiles}
        setDirectories={setDirectories}
      />
    </>
  );
}

export default App;

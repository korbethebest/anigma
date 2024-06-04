import { useState } from "react";
import { Info, Criteria } from "../../types/types";
import Header from "../Header/Header";
import FilterAndSort from "../FilterAndSort/FilterAndSort";
import Main from "../Main/Main";
import { sortByCriteria } from "../../utils/utils";

function App() {
  const [currentDirectory, setCurrentDirectory] = useState("");
  const [files, setFiles] = useState<Info[]>([]);
  const [directories, setDirectories] = useState<Info[]>([]);
  const [searchTarget, setSearchTarget] = useState("");
  const [sortCriteria, setSortCriteria] = useState<keyof Criteria>("name");

  const handleCurrentDirectoryChange = (directory: string) => {
    setCurrentDirectory(directory);
  };

  const filteredFiles = searchTarget.length
    ? sortByCriteria(files, sortCriteria).filter((file) =>
        file.name
          .trim()
          .toLowerCase()
          .normalize()
          .includes(searchTarget.trim().toLowerCase().normalize())
      )
    : sortByCriteria(files, sortCriteria);
  const filteredDirectories = searchTarget.length
    ? sortByCriteria(directories, sortCriteria).filter((directory) =>
        directory.name
          .trim()
          .toLowerCase()
          .normalize()
          .includes(searchTarget.trim().toLowerCase().normalize())
      )
    : sortByCriteria(directories, sortCriteria);

  return (
    <>
      <Header
        onDirectoryChange={handleCurrentDirectoryChange}
        currentDirectory={currentDirectory || "Loading..."}
      />
      <FilterAndSort
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
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

import { useState } from "react";
import Header from "./components/Header";
import { FileInfo } from "./types/types";

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

  return (
    <>
      <Header onDirectoryChange={handleDirectoryChange} />
      <main>
        {files.length && (
          <div>
            <h3>Directories:</h3>
            <ul>
              {directories.map((directory, index) => (
                <li key={index}>{directory}</li>
              ))}
            </ul>
            <h3>Files:</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <img src={file.icon} alt={file.name} width={32} height={32} />
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}

export default App;

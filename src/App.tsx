import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [files, setFiles] = useState<string[]>([]);
  const [directories, setDirectories] = useState<string[]>([]);

  const handleDirectoryChange = (
    newFiles: string[],
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
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}

export default App;

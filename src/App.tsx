import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [files, setFiles] = useState<string[]>([]);

  const handleDirectoryChange = (newFiles: string[]) => {
    setFiles(newFiles);
  };

  return (
    <>
      <Header onDirectoryChange={handleDirectoryChange} />
      <main>
        {files.length && (
          <div>
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

import { useState } from "react";
import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";

const App = () => {
  const [uploadCount, setUploadCount] = useState(0);

  const handleUploadComplete = () => {
    setUploadCount(uploadCount + 1); // Increment upload count to trigger refresh
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <FileUploader onUploadComplete={handleUploadComplete} />
        <FileList refreshKey={uploadCount} />
      </div>
    </div>
  );
};

export default App;

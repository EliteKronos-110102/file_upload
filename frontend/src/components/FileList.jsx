import { useEffect, useState } from "react";
import axios from "axios";

const FileList = ({ refreshKey }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of files from the backend
    axios
      .get("http://localhost:3001/api/files")
      .then((response) => {
        setFiles(response.data); // Assuming the backend sends an array of file objects
      })
      .catch((error) => console.error("Error fetching files:", error));
  }, [refreshKey]);

  const downloadFile = (fileName) => {
    // Trigger file download by sending a request to the backend's download endpoint
    axios({
      url: `http://localhost:3001/api/download/${encodeURIComponent(fileName)}`,
      method: "GET",
      responseType: "blob", // Important for handling the binary file response
    })
      .then((response) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // Set the file name for download
        document.body.appendChild(link);
        link.click(); // Trigger the download

        // Cleanup by removing the link element and revoking the URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Available Files</h3>
      <ul>
        {files.map((file, index) => (
          <li
            className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-3"
            key={index}
          >
            {file.originalName} - {Math.round(file.size / 1024)} KB
            <button
              onClick={() => downloadFile(file.originalName)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors duration-200 ease-in-out"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;

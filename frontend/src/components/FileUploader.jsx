// import { useState } from "react";
// import axios from "axios";

// const FileUploader = ({ onUploadComplete }) => {
//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const onFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const uploadChunk = async (chunk, index, totalChunks, fileName) => {
//     const formData = new FormData();
//     formData.append("chunk", chunk);
//     formData.append("fileName", fileName); // Unique identifier for the file
//     formData.append("chunkIndex", index);
//     formData.append("totalChunks", totalChunks);
//     formData.append("originalName", file.name);
//     formData.append("size", file.size);
//     formData.append("mimeType", file.type);

//     return axios.post("http://localhost:3001/api/upload", formData, {
//       onUploadProgress: (progressEvent) => {
//         const uploadPercentage = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         setProgress((prevProgress) => {
//           const totalProgress =
//             ((index + uploadPercentage / 100) / totalChunks) * 100;
//           return Math.max(prevProgress, totalProgress.toFixed(2));
//         });
//       },
//     });
//   };

//   // const onUpload = async () => {
//   //   if (!file) return;

//   //   const chunkSize = 1 * 1024 * 1024; // 1MB
//   //   const totalChunks = Math.ceil(file.size / chunkSize);
//   //   const fileName = `${file.name}-${Date.now()}`;

//   //   for (let index = 0; index < totalChunks; index++) {
//   //     const chunk = file.slice(index * chunkSize, (index + 1) * chunkSize);
//   //     await uploadChunk(chunk, index, totalChunks, fileName);
//   //   }

//   //   alert("Upload complete");
//   //   onUploadComplete();
//   // };

//   const onUpload = async () => {
//     if (!file) return;

//     const chunkSize = 1 * 1024 * 1024; // 1MB
//     const totalChunks = Math.ceil(file.size / chunkSize);
//     const fileName = `${file.name}-${Date.now()}`;

//     for (let index = 0; index < totalChunks; index++) {
//       const chunk = file.slice(index * chunkSize, (index + 1) * chunkSize);
//       await uploadChunk(chunk, index, totalChunks, fileName);
//     }

//     setProgress(0); // Reset progress to 0 before showing the alert
//     alert("Upload complete");
//     onUploadComplete();
//   };

//   return (
//     <div className="p-4 shadow-lg rounded-lg bg-white max-w-md mx-auto mt-10">
//       <input
//         className="block w-full text-sm text-gray-500
//       file:mr-4 file:py-2 file:px-4
//       file:rounded-full file:border-0
//       file:text-sm file:font-semibold
//       file:bg-blue-50 file:text-blue-700
//       hover:file:bg-blue-100"
//         type="file"
//         onChange={onFileChange}
//       />
//       <button
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
//         onClick={onUpload}
//       >
//         Upload
//       </button>
//       {progress > 0 && <div>Upload Progress: {progress}%</div>}
//     </div>
//   );
// };

// export default FileUploader;

import { useState } from "react";
import axios from "axios";

const FileUploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0); // Reset progress when a new file is selected
  };

  const uploadChunk = async (chunk, index, totalChunks, fileName) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", fileName); // Unique identifier for the file
    formData.append("chunkIndex", index);
    formData.append("totalChunks", totalChunks);
    formData.append("originalName", file.name);
    formData.append("size", file.size);
    formData.append("mimeType", file.type);

    return axios.post("http://localhost:3001/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const uploadPercentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress((prevProgress) => {
          const totalProgress =
            ((index + uploadPercentage / 100) / totalChunks) * 100;
          return Math.max(prevProgress, totalProgress.toFixed(2));
        });
      },
    });
  };

  const onUpload = async () => {
    if (!file) return;

    const chunkSize = 1 * 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = `${file.name}-${Date.now()}`;

    for (let index = 0; index < totalChunks; index++) {
      const chunk = file.slice(index * chunkSize, (index + 1) * chunkSize);
      await uploadChunk(chunk, index, totalChunks, fileName);
    }

    setProgress(0); // Reset progress to 0 before showing the alert
    alert("Upload complete");
    onUploadComplete();
  };

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white max-w-md mx-auto mt-10">
      <input
        className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100"
        type="file"
        onChange={onFileChange}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        onClick={onUpload}
      >
        Upload
      </button>
      <div className="mt-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress > 0 && <div className="text-right">{progress}%</div>}
    </div>
  );
};

export default FileUploader;

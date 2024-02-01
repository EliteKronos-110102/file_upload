const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const File = require("../models/File"); // Ensure this path matches your file model location
const router = express.Router();

// Configure multer for handling multipart/form-data and storing chunks temporarily
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("chunk"), async (req, res) => {
  const { originalName, fileName, chunkIndex, totalChunks, size, mimeType } =
    req.body;
  const chunkDir = path.join(__dirname, "..", "uploads", fileName);
  const chunkPath = path.join(chunkDir, chunkIndex);

  // Ensure chunk directory exists
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  // Move uploaded chunk to its directory
  fs.renameSync(req.file.path, chunkPath, (err) => {
    if (err) {
      return res.status(500).send("Error moving chunk.");
    }
  });

  // Check if all chunks have been uploaded
  if (fs.readdirSync(chunkDir).length.toString() === totalChunks) {
    // Ensure the final directory exists
    const finalDir = path.join(__dirname, "..", "final");
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // Reassemble chunks into the final file
    const filePath = path.join(finalDir, originalName);
    const fileStream = fs.createWriteStream(filePath);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = fs.readFileSync(path.join(chunkDir, i.toString()));
      fileStream.write(chunk);
      fs.unlinkSync(path.join(chunkDir, i.toString())); // Delete chunk after appending
    }

    fileStream.end();

    // Save file metadata in MongoDB
    const fileMetadata = new File({
      originalName,
      fileName: originalName, // For simplicity, using originalName as the fileName in the database
      size,
      mimeType,
      uploadDate: new Date(),
    });

    try {
      await fileMetadata.save();
      // Optionally, clean up the chunk directory after successful reassembly
      fs.rmdirSync(chunkDir, { recursive: true });
      res.send({
        message: "File uploaded successfully",
        fileName: originalName,
      });
    } catch (error) {
      res.status(500).send("Error saving file metadata: " + error.message);
    }
  } else {
    res.send({ message: "Chunk uploaded", index: chunkIndex });
  }
});

// Endpoint to list all files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find({});
    res.json(files);
  } catch (error) {
    res.status(500).send("Error fetching file list: " + error.message);
  }
});

// Endpoint to download a file
router.get("/download/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "..", "final", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  res.download(filePath, fileName);
});

module.exports = router;


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileRoutes = require("./routes/files");

const app = express();
dotenv.config();
const port = 3001;

app.use(cors());

mongoose.connect(process.env.MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/api", fileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

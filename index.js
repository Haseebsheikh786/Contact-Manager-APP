const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

app.use(morgan("default"));

app.use(express.static(path.resolve(__dirname, "build")));
// errorHandler
app.use(errorHandler);
// routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
// database connected
connectDb();
// show in terminal
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

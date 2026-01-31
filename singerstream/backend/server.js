require("dotenv").config({ path: require('path').resolve(__dirname, '..', '.env') });   // MUST be first (loads root .env when running from /backend)

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);

// Global error handlers to prevent unexpected process exit during development
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(3000, () => console.log("Server running on 3000"));

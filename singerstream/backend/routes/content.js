const express = require("express");
const db = require("../config/database");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const fs = require("fs");
const router = express.Router();

router.post("/", auth, upload.single("file"), async (req, res) => {
  const { title, type, description } = req.body;

  await db.query(
    "INSERT INTO content(title,type,file_path,description,admin_id) VALUES($1,$2,$3,$4,$5)",
    [title, type, req.file.path, description, req.user.id]
  );
  res.json({ msg: "Uploaded" });
});

router.get("/", async (req, res) => {
  const data = await db.query("SELECT id,title,type,description FROM content");
  res.json(data.rows);
});

router.get("/stream/:id", async (req, res) => {
  const result = await db.query("SELECT file_path FROM content WHERE id=$1", [
    req.params.id
  ]);
  const filePath = result.rows[0].file_path;
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    "Content-Length": stat.size
  });
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router;

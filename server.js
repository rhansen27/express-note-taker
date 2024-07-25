const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const path = require("path");
const fs = require("fs/promises");
const dbLocation = path.join(__dirname, "db", "db.json");
const usedIDS = [];

function getRandomInt() {
  return Math.floor(Math.random() * 10000000);
}

async function getID() {
  const savedNoted = (await fs.readFile(dbLocation, "utf8")) || [];
  const notes = JSON.parse(savedNoted);
  let randomNumber = getRandomInt();
  notes.forEach((note) => {
    if (!usedIDS.includes(note.id)) {
      usedIDS.push(note.id);
    }
  });
  while (usedIDS.includes(randomNumber)) {
    randomNumber = getRandomInt();
  }

  return randomNumber;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/notes", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", async (req, res) => {
  res.sendFile("./db/db.json", { root: __dirname });
});

app.post("/api/notes", async (req, res) => {
  const savedNotes = (await fs.readFile(dbLocation, "utf8")) || [];
  const messageBody = req.body;
  const notes = JSON.parse(savedNotes);
  messageBody.id = await getID();
  notes.push(messageBody);

  await fs.writeFile(dbLocation, JSON.stringify(notes));
  res.sendFile(dbLocation, JSON.stringify(notes));
  res.end();
});

app.delete("/api/notes/:id", async (req, res) => {
  const savedNotes = (await fs.readFile(dbLocation, "utf8")) || [];
  const notes = JSON.parse(savedNotes);
  const { id } = req.params;

  const filteredNotes = notes.filter((note) => note.id != id);
  await fs.writeFile(dbLocation, JSON.stringify(filteredNotes));
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

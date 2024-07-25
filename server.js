const express = require("express");
const port = process.env.PORT || 3000;
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
    if (!userdIDS.includes(note.id)) {
      usedIDS.push(note.id);
    }
  });
  while (usedIDS.includes(randomNumber)) {
    randomNumber = getRandomInt();
  }

  return randomNumber;
}

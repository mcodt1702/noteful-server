const express = require("express");
const NotesService = require("./notes-service");
const NotesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

serializeNote = (note) => ({
  note_id: note.note_id,
  name: note.name,
  modified: note.modified,
  folder_Id: note.folder_Id,
  content: note.content,
});

NotesRouter.route("/").get((req, res, next) => {
  NotesService.getAllNotes(req.app.get("db"))
    .then((note) => {
      res.json(note.map(serializeNote));
    })
    .catch(next);
});

module.exports = NotesRouter;

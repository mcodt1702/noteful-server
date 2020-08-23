const express = require("express");
const NotesService = require("./notes-service");
const NotesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

serializeNote = (note) => ({
  note_id: note.note_id,
  name: note.name,
  modified: note.modified,
  folder_id: note.folder_id,
  content: note.content,
});

NotesRouter.route("/")
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get("db"))
      .then((note) => {
        res.json(note.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, modified, folder_id, content } = req.body;
    const newNote = { name, modified, folder_id, content };

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    NotesService.insertNote(req.app.get("db"), newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.note_id}`))

          .json(serializeNote(note));
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { name, modified, folder_id, content } = req.body;
    const noteToUpdate = { name, modified, folder_id, content };
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either name, modified, folder_id or content'`,
        },
      });
    }
    NotesService.updateNote(req.app.get("db"), req.params.note_id, noteToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

NotesRouter.route("/:note_id")
  .all((req, res, next) => {
    NotesService.getNoteById(req.app.get("db"), req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` },
          });
        }
        res.note = note; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })

  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.note_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = NotesRouter;

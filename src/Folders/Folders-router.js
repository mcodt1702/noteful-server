const express = require("express");
const FoldersService = require("./folders-service");
const FoldersRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

serializeFolder = (folder) => ({
  folder_id: folder.folder_id,
  name: folder.name,
});

FoldersRouter.route("/")
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get("db"))
      .then((folder) => {
        res.json(folder.map(serializeFolder));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    FoldersService.insertFolder(req.app.get("db"), newFolder)
      .then((folder) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.folder_id}`))

          .json(serializeNote(folder));
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"), req.params.folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

FoldersRouter.route("/:folder_id")
  .all((req, res, next) => {
    FoldersService.getFolderById(req.app.get("db"), req.params.folder_id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` },
          });
        }
        res.folder = folder; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })

  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"), req.params.folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = FoldersRouter;

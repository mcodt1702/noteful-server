const express = require("express");
const FoldersService = require("./folders-service");
const FoldersRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

serializeFolder = (folder) => ({
  folder_id: folder.folder_id,
  name: folder.name,
});

FoldersRouter.route("/").get((req, res, next) => {
  FoldersService.getAllFolders(req.app.get("db"))
    .then((folder) => {
      res.json(folder.map(serializefolder));
    })
    .catch(next);
});

module.exports = FoldersRouter;

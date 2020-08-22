const knex = require("knex");

const FoldersService = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into("folders")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getFolderById(knex, id) {
    return knex.from("folders").select("*").where("folder_id", id).first();
  },

  deleteFolder(knex, id) {
    return knex("folders").where({ id }).delete();
  },
};
module.exports = FoldersService;

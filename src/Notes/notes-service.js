const knex = require("knex");

const NoteService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("notes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getNoteById(knex, id) {
    return knex.from("notes").select("*").where("note_id", id).first();
  },

  deleteNote(knex, id) {
    return knex("notes").where({ id }).delete();
  },

  updateNote(knex, id, noteToUpdate) {
    return knex("notes").where({ id }).update(noteToUpdate);
  },
};

module.exports = NoteService;

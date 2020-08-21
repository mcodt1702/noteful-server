CREATE TABLE folders
(
    folder_Id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE notes
(
    note_ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    modified TIMESTAMPTZ DEFAULT now(),
    folder_id INTEGER
        REFERENCES folders
(folder_id) ON
DELETE CASCADE NOT NULL

);

const fs = require("fs");
const util = require("util");
const app = require("express").Router();
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
var noteD;



// GET 
app.get("/notes", (req, res) => {

    readFileAsync("db/db.json", "utf8").then(function (data) {

        noteD = JSON.parse(data);
       
        res.json(noteD);
    });
});

// POST
app.post("/notes", (req, res) => {
    readFileAsync("db/db.json", "utf8").then(function (data) {
        noteD = JSON.parse(data);

        let newNote = req.body;
        let currentID = noteD.length;

        newNote.id = currentID + 1;

        noteD.push(newNote);

        noteD = JSON.stringify(noteD);

        writeFileAsync("db/db.json", noteD).then(function (data) {
        });
        res.json(noteD);
    });
});

// DELETE
app.delete("/notes/:id", (req, res) => {
    let selID = parseInt(req.params.id);

    for (let i = 0; i < noteD.length; i++) {
        if (selID === noteD[i].id) {
            noteD.splice(i, 1);
            let noteJSON = JSON.stringify(noteD, null, 2);

            writeFileAsync("db/db.json", noteJSON).then(function () {
                console.log("Note has been deleted.");
            });
        }
    }
    res.json(noteD);
});

module.exports = app;
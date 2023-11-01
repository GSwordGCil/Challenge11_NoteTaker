const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
// Get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Post a new note
app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred');
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
        } else {
            const notes = JSON.parse(data);
            const updatedNotes = notes.filter(note => note.id !== noteId);

            fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred');
                } else {
                    res.json({ ok: true });
                }
            });
        }
    });
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

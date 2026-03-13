const express = require('express');
const ideasRouter = express.Router();

const {getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    deleteFromDatabaseById,
    updateInstanceInDatabase,
    isValidIdea,
} = require("./db.js");

const checkMillionDollarIdea = require("./checkMillionDollarIdea.js");

ideasRouter.param('ideaId', (req, res, next, ideaId) => {
    const idea = getFromDatabaseById('ideas', ideaId);
    if (!idea) {
        return res.status(404).send('Idea does not exist.');
    } else {
        req.idea = idea;
        next();
    }
});

// get an array of all ideas
ideasRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase('ideas'));
});
// create a new idea and save it to the database.
ideasRouter.post('/', checkMillionDollarIdea, (req, res) => {
    const newIdea = addToDatabase('ideas', req.body);
    if (!isValidIdea(newIdea)) {
        return res.status(400).send('Idea is not valid.');
    }
    res.status(201).send(newIdea);
});

//  get a single idea by id
ideasRouter.get('/:ideaId', (req, res) => {
    res.send(req.idea);
});
// update a single idea by id
ideasRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    req.body.id = req.params.ideaId;
    const updated = (updateInstanceInDatabase('ideas', req.body));
    if (!updated) {
        return res.status(404).send('Idea does not exist.');
    }
    res.send(updated);
});
// delete a single idea by id
ideasRouter.delete('/:ideaId', (req, res) => {
    (deleteFromDatabaseById('ideas', req.idea.id));
    res.status(204).send();
});

module.exports = ideasRouter;
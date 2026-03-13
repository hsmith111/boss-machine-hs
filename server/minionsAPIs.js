const express = require('express');
const minionsRouter = express.Router();

const {getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    deleteFromDatabaseById,
    updateInstanceInDatabase,
    isValidMinion,
} = require("./db.js");

minionsRouter.param('minionId', (req, res, next, minionId) => {
    const minion = getFromDatabaseById('minions', minionId);
    if (!minion) {
        return res.status(404).send('Minion does not exist.');
    } else {
        req.minion = minion;
        next();
    }
});

// get an array of all minions
minionsRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase('minions'));
});
// create a new minion and save it to the database.
minionsRouter.post('/', (req, res) => {
    const newMinion = req.body;
    if (!isValidMinion(newMinion)) {
        return res.status(400).send('Minion is not valid.');
    }
    res.status(201).send(addToDatabase('minions', newMinion));
});
//  get a single minion by id
minionsRouter.get('/:minionId', (req, res) => {
    res.send(req.minion);
});
// update a single minion by id
minionsRouter.put('/:minionId', (req, res) => {
    req.body.id = req.params.minionId
    const updated = (updateInstanceInDatabase('minions', req.body));
    if (!updated) {
        return res.status(404).send('Minion does not exist.');
    }
    res.send(updated);
});
// delete a single minion by id
minionsRouter.delete('/:minionId', (req, res) => {
    (deleteFromDatabaseById('minions', req.minion.id));
    res.status(204).send();
});

module.exports = minionsRouter;
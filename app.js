const express = require('express');
const app = express();

// Add middleware for handling CORS requests from index.html
const cors = require('cors');
app.use(cors());

// Add middleware for parsing request bodies here:
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
const {getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    deleteFromDatabaseById,
    updateInstanceInDatabase,
    deleteAllFromDatabase,
    isValidMinion,
    isValidIdea,
    isValidMeeting,
    createMeeting
} = require("./server/db.js");

const checkMillionDollarIdea = require('./server/checkMillionDollarIdea');

// MINIONS routes
apiRouter.param('minionId', (req, res, next, minionId) => {
    const minion = getFromDatabaseById('minions', minionId);
    if (!minion) {
        return res.status(404).send('Minion does not exist.');
    } else {
        req.minion = minion;
        next();
    }
});

// get an array of all minions
apiRouter.get('/minions', (req, res) => {
    res.send(getAllFromDatabase('minions'));
});
// create a new minion and save it to the database.
apiRouter.post('/minions', (req, res) => {
    const newMinion = req.body;
    if (!isValidMinion(newMinion)) {
        return res.status(400).send('Minion is not valid.');
    }
    res.status(201).send(addToDatabase('minions', newMinion));
});
//  get a single minion by id
apiRouter.get('/minions/:minionId', (req, res) => {
    res.send(req.minion);
});
// update a single minion by id
apiRouter.put('/minions/:minionId', (req, res) => {
    req.body.id = req.params.minionId
    const updated = (updateInstanceInDatabase('minions', req.body));
    if (!updated) {
        return res.status(404).send('Minion does not exist.');
    }
    res.send(updated);
});
// delete a single minion by id
apiRouter.delete('/minions/:minionId', (req, res) => {
    (deleteFromDatabaseById('minions', req.minion.id));
    res.status(204).send();
});

// IDEAS routes
apiRouter.param('ideaId', (req, res, next, ideaId) => {
    const idea = getFromDatabaseById('ideas', ideaId);
    if (!idea) {
        return res.status(404).send('Idea does not exist.');
    } else {
        req.idea = idea;
        next();
    }
});

// get an array of all ideas
apiRouter.get('/ideas', (req, res) => {
    res.send(getAllFromDatabase('ideas'));
});
// create a new idea and save it to the database.
apiRouter.post('/ideas', checkMillionDollarIdea, (req, res) => {
    const newIdea = addToDatabase('ideas', req.body);
    if (!isValidIdea(newIdea)) {
        return res.status(400).send('Idea is not valid.');
    }
    res.status(201).send(newIdea);
});

//  get a single idea by id
apiRouter.get('/ideas/:ideaId', (req, res) => {
    res.send(req.idea);
});
// update a single idea by id
apiRouter.put('/ideas/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    req.body.id = req.params.ideaId;
    const updated = (updateInstanceInDatabase('ideas', req.body));
    if (!updated) {
        return res.status(404).send('Idea does not exist.');
    }
    res.send(updated);
});
// delete a single idea by id
apiRouter.delete('/ideas/:ideaId', (req, res) => {
    (deleteFromDatabaseById('ideas', req.idea.id));
    res.status(204).send();
});

// MEETINGS routes
apiRouter.param('meetingId', (req, res, next, meetingId) => {
    const meeting = getFromDatabaseById('meetings', meetingId);
    if (!meeting) {
        return res.status(404).send('Meeting does not exist.');
    } else {
        req.meeting = meeting;
        next();
    }
});

// get an array of all meetings
apiRouter.get('/meetings', (req, res) => {
    res.send(getAllFromDatabase('meetings'));
});
// create a new meeting and save it to the database.
apiRouter.post('/meetings', (req, res) => {
    const newMeeting = createMeeting();
    const addedMeeting = addToDatabase('meetings', newMeeting);
    if (isValidMeeting(addedMeeting)) {
        res.status(201).send(addedMeeting);
    }
});
// delete all meetings from the database.
apiRouter.delete('/meetings', (req, res) => {
    (deleteAllFromDatabase('meetings'));
    res.status(204).send();
});

app.use('/api', apiRouter);

module.exports = app;

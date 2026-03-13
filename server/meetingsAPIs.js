const express = require('express');
const meetingsRouter = express.Router();

const {getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    deleteAllFromDatabase,
    isValidMeeting,
    createMeeting
} = require("./db.js");

meetingsRouter.param('meetingId', (req, res, next, meetingId) => {
    const meeting = getFromDatabaseById('meetings', meetingId);
    if (!meeting) {
        return res.status(404).send('Meeting does not exist.');
    } else {
        req.meeting = meeting;
        next();
    }
});

// get an array of all meetings
meetingsRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase('meetings'));
});
// create a new meeting and save it to the database.
meetingsRouter.post('/', (req, res) => {
    const newMeeting = createMeeting();
    const addedMeeting = addToDatabase('meetings', newMeeting);
    if (isValidMeeting(addedMeeting)) {
        res.status(201).send(addedMeeting);
    }
});
// delete all meetings from the database.
meetingsRouter.delete('/', (req, res) => {
    (deleteAllFromDatabase('meetings'));
    res.status(204).send();
});

module.exports = meetingsRouter;
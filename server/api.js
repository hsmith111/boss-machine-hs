const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minionsAPIs');
const ideasRouter = require('./ideasAPIs');
const meetingsRouter = require('./meetingsAPIs');

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter);


module.exports = apiRouter;

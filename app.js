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

app.use('/api', apiRouter);

module.exports = app;

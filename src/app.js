const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//Carrega routes
const indexRoute = require('./routes/index-route');
const sessionsRoute = require('./routes/sessions-route');

app.use( "/" , indexRoute );
app.use( "/sessions/" , sessionsRoute );

module.exports = app;
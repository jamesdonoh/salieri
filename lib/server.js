const fs = require('fs');
const express = require('express');

const SERVER_PORT = 3000;
const filename = 'template.html';

const readFile = (filename) => fs.readFileSync(filename, 'utf-8');

const app = express();

const config = 'config.json';
const template = 'template.html';

app.locals.config = readFile(config);
app.locals.template = readFile(template);

app.locals.logError = (...args) => process.env.NODE_ENV !== 'test' && console.error(...args);

// assume layout config and template have been loaded by now

app.get(
    '/',
    require('./prepare-requests'),
    require('./make-requests'),
    require('./handle-errors'),
    require('./add-labels'),
    require('./combine-envelopes'),
    require('./render-template')
);

app.listen(SERVER_PORT, () => console.log('Listening on port %d', SERVER_PORT));

const fs = require('fs');
const express = require('express');

const SERVER_PORT = 3000;
const filename = 'template.html';

const readFile = (filename) => fs.readFileSync(filename, 'utf-8');

const app = express();

const config = process.argv[2] || 'config.json';
const template = process.argv[3] || 'template.html';

app.locals.config = readFile(config);
app.locals.template = readFile(template);

app.locals.labelAll = true;
app.locals.logError = (...args) => process.env.NODE_ENV !== 'test' && console.error(...args);

// assume layout config and template have been loaded by now

app.get(
    '/',
    require('./prepareRequests'),
    require('./makeRequests'),
    require('./handleErrors'),
    require('./addLabels'),
    require('./renderTemplate')
);

app.listen(SERVER_PORT, () => console.log('Salieri composing on port %d', SERVER_PORT));

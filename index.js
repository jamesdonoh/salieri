'use strict';

var fs = require('fs'),
    request = require('request-promise'),
    makeBuilder = require('./lib/builder').makeBuilder,
    server = require('./lib/server'),
    envelope = require('./lib/envelope');

const SERVER_PORT = 3000;

if (process.argv.length < 4) {
    console.log('Usage: node %s <template> <config> [params]', process.argv[1]);
    process.exit(1);
}

var readText = (filename) => fs.readFileSync(filename, 'utf-8'),
    readJson = (filename) => JSON.parse(readText(filename));

var template = readText(process.argv[2]),
    config = readJson(process.argv[3]),
    params = process.argv.length > 4 ? readJson(process.argv[4]) : {};

// Optionally enable TLS certificate support
if (process.env.CERT_FILE && process.env.CA_FILE) {
    let certData = fs.readFileSync(process.env.CERT_FILE),
        caData = fs.readFileSync(process.env.CA_FILE);

    request = request.defaults({ cert: certData, key: certData, ca: caData });
}

const buildPage = makeBuilder(template, envelope, config, request, params);

server.start(buildPage, SERVER_PORT);

console.log('Listening on port %d', SERVER_PORT);

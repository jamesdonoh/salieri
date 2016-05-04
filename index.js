'use strict';

var fs = require('fs'),
    rp = require('request-promise'),
    server = require('./server');

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

    rp = rp.defaults({ cert: certData, key: certData, ca: caData });
}

server.start(rp, template, config, params, SERVER_PORT);

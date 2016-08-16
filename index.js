'use strict';

/* eslint no-sync: "off" */

const fs = require('fs');
const SERVER_PORT = 3000;

const argv = require('yargs')
    .usage('Usage: $0 [options] -t <template> -c <config>')
    .option('template', {
        alias: 't',
        demand: true,
        describe: 'path to page template'
    })
    .option('config', {
        alias: 'c',
        demand: true,
        describe: 'path to page config JSON'
    })
    .option('cert', {
        describe: 'use specified client certificate for TLS'
    })
    .option('cacert', {
        describe: 'use specified CA certificate for TLS'
    })
    .option('labels', {
        describe: 'show component labels to help with debugging',
        default: false
    })
    .option('noerrors', {
        describe: 'do not display request errors in markup',
        default: false
    })
    .option('staticprefix', {
        describe: 'prefix which identifies a request for a static asset',
        default: '/img'
    })
    .option('statichost', {
        describe: 'where to send requests for static assets',
        default: 'localhost'
    })
    .option('staticpath', {
        describe: 'path on the statichost where the static assets are',
        default: '/img'
    })
    .help('help')
    .argv;

const readFile = filename => fs.readFileSync(filename, 'utf-8');

const template = readFile(argv.template);
const config = readFile(argv.config);

let rp = require('request-promise');

if (argv.cert) {
    const certData = readFile(argv.cert);

    rp = rp.defaults({ cert: certData, key: certData });
}

if (argv.cacert) {
    rp = rp.defaults({ ca: readFile(argv.cacert) });
}

const Envelope = require('./lib/envelope')(argv);

const createBuilder = require('./lib/builder').createBuilder;
const buildPage = createBuilder(template, config, rp, Envelope);

const server = require('./lib/server');

server.createServer(buildPage, argv.staticprefix, argv.statichost, argv.staticpath)
    .listen(SERVER_PORT, () => console.log('Listening on port %d', SERVER_PORT, ', images served from', argv.statichost));

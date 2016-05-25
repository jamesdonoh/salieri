'use strict';

const readFile = (filename) => require('fs').readFileSync(filename, 'utf-8');
let rp = require('request-promise');

const createBuilder = require('./lib/builder').createBuilder;
const server = require('./lib/server');

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
        describe: 'send the specified client certificate to HTTPS servers'
    })
    .option('cacert', {
        describe: 'use the specified CA certificate to verify HTTPS servers'
    })
    .option('labels', {
        describe: 'show component labels to help with debugging',
        default: false
    })
    .option('noerrors', {
        describe: 'do not display request/parsing errors in markup',
        default: false
    })
    .help('help')
    .argv;

const template = readFile(argv.template);
const config = readFile(argv.config);

if (argv.cert) {
    const certData = readFile(argv.cert);
    rp = rp.defaults({ cert: certData, key: certData });
}

if (argv.cacert) {
    rp = rp.defaults({ ca: readFile(argv.cacert) });
}

const Envelope = require('./lib/envelope')(argv);

const buildPage = createBuilder(template, config, rp, Envelope);

server.createServer(buildPage)
    .listen(SERVER_PORT, () => console.log('Listening on port %d', SERVER_PORT));

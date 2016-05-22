'use strict';

const readFile = (filename) => require('fs').readFileSync(filename, 'utf-8');
let request = require('request-promise');

const createBuilder = require('./lib/builder').createBuilder;
const server = require('./lib/server');
const Envelope = require('./lib/envelope')({ addLabels: true });

const SERVER_PORT = 3000;

if (require.main === module) {
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
        .option('show-labels', {
            describe: 'show component labels to help with debugging'
        })
        .option('hide-errors', {
            describe: 'do not display request/parsing errors in markup'
        })
        .argv;

    if (process.argv.length < 4) {
        console.log('Usage: npm start <template> <config>');
        process.exit(1);
    }

    const template = readFile(argv.template);
    const config = readFile(argv.config);

    // Optionally enable TLS certificate support
    if (process.env.CERT_FILE && process.env.CA_FILE) {
        let certData = readFile(process.env.CERT_FILE),
            caData = readFile(process.env.CA_FILE);

        request = request.defaults({ cert: certData, key: certData, ca: caData });
    }

    const buildPage = createBuilder(template, config, request, Envelope);

    server.createServer(buildPage).listen(SERVER_PORT);

    console.log('Listening on port %d', SERVER_PORT);
}

#!/usr/bin/env node

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
    .option('labelall', {
        alias: 'l',
        describe: 'show labels for all components to help with debugging',
        default: false
    })
    .help('help')
    .argv;

const readFile = (filename) => require('fs').readFileSync(filename, 'utf-8');

const rp = require('../lib/rp')(argv.cert, argv.cacert);

const template = readFile(argv.template);

const config = readFile(argv.config);
JSON.parse(config); // Fail fast if config is invalid

const app = require('../lib/server')(rp, config, template, argv.labelall);

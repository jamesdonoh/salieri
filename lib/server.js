'use strict';

var render = require('mustache').render,
    express = require('express'),
    _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'],
    ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

function buildUrls(urls, params) {
    return urls.map(url => render(url, params));
}

function requestAllEnvelopes(rp, urls) {
    return Promise.all(urls.map(url => rp(url)));
}

function combineData(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes).map(JSON.parse).map(key).flatten().join('\n'));
}

function start(rp, template, config, params, port) {
    let endpoints = _.chain(config).get('components').map('endpoint').value(),
        renderPage = _.partial(render, template);

    express()
        .get('/', (req, res, next) =>
            requestAllEnvelopes(rp, buildUrls(endpoints, params))
                .then(combineData)
                .then(renderPage)
                .then(page => res.send(page))
                .catch(next)
        )
        .listen(port);
}

exports.start = start;

'use strict';

const render = require('mustache').render,
    _ = require('lodash');

function buildUrls(config, params) {
    return _.chain(config)
        .get('components')
        .map('endpoint')
        .map(url => render(url, params));
}

function requestAllUrls(request, urls) {
    const requests = urls.map(url => request(url)
        .catch(err => {
            console.error('Error requesting %s: %s', url, err.stack);
            return `{"bodyInline": "FAILED: ${url}"}`;
        }));

    return Promise.all(requests);
}

function makeBuilder(template, reduceResponses, config, request, params) {
    let urls = buildUrls(config, params),
        renderPage = _.partial(render, template);

    return () =>
        requestAllUrls(request, urls)
            .then(reduceResponses)
            .then(renderPage);
}

exports.makeBuilder = makeBuilder;

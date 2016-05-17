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
    return Promise.all(urls.map(url => request(url)));
}

function makeBuilder(template, reduceResponses, config, request, params) {
    let urls = buildUrls(config, params),
        jsonRequest = request.defaults({ json: true }),
        renderPage = _.partial(render, template);

    return () =>
        requestAllUrls(jsonRequest, urls)
            .then(reduceResponses)
            .then(renderPage);
}

exports.makeBuilder = makeBuilder;

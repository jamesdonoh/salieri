'use strict';

const render = require('mustache').render,
    _ = require('lodash');

function requestAllUrls(components, request, envelope, params) {
    const parsedEnvelopes = components.map(component =>
        request(render(component.endpoint, params))
        .then(body => envelope.parse(body, component.id))
        .catch(err => envelope.recoverError(err, component.endpoint)));

    return Promise.all(parsedEnvelopes);
}

function makeBuilder(template, envelope, config, request, params) {
    let renderPage = _.partial(render, template);

    return () =>
        requestAllUrls(config.components, request, envelope, params)
            .then(envelope.combine)
            .then(renderPage);
}

exports.makeBuilder = makeBuilder;

'use strict';

const Mustache = require('mustache');

function getComponents(config, params) {
    const configWithParams = Mustache.render(config, params);

    return JSON.parse(configWithParams).components;
}

function createBuilder(template, config, rp, Envelope = {}) {
    const renderPage = (data) => Mustache.render(template, data);

    const requestAndParse = (component) =>
        rp(component.endpoint)
        .then(body => Envelope.parse(body, component))
        .catch(err => Envelope.recoverError(err, component));

    return function buildPage(params) {
        let parsedEnvelopes = [];

        if (config) {
            const components = getComponents(config, params);
            parsedEnvelopes = components.map(requestAndParse);
        }

        return Promise.all(parsedEnvelopes)
            .then(Envelope.combine)
            .then(renderPage);
    }
}

exports.createBuilder = createBuilder;

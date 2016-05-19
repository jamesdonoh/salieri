'use strict';

const _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'],
    ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

function parse(body) {
    return JSON.parse(body);
}

function parseDebug(body, componentId) {
    let parsed = parse(body);

    parsed.bodyInline = `
        <p style="background-color: green; color: white; position: absolute">${componentId}</p>
        ${parsed.bodyInline}
    `;

    return parsed;
}

function combine(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes)
            .map(key)
            .flatten()
            .join('\n'));
}

function recoverError(err, url) {
    console.error('Error for %s: %s', url, err.message);

    return { bodyInline: `<p style="border: 1px solid red; color: red;">FAILED: ${url}</p>` };
}

module.exports = {
    parse: parseDebug,
    combine: combine,
    recoverError: recoverError
};

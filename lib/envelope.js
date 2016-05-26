'use strict';

const _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'],
    ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

function combine(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes)
            .map(key)
            .flatten()
            .join('\n'));
}

function p(style, body) {
    return `<p style="${style}">${body}</p>`;
}

module.exports = function (options = {}) {
    function parse(body, component) {
        let parsed = JSON.parse(body);

        if (options.labels) {
            const style = 'background-color: green; color: white; position: absolute';
            parsed.bodyInline = p(style, component.id) + parsed.bodyInline;
        }

        return parsed;
    }

    function recoverError(err, component) {
        const url = component.endpoint;

        console.error('Error for %s: %s', url, err.message);

        if (options.noerrors) {
            return {};
        } else {
            const style = 'border: 1px solid red; color: red;';
            return { bodyInline: p(style, 'FAILED: ' + url) };
        }
    }

    return {
        parse: parse,
        combine: combine,
        recoverError: recoverError
    }
};

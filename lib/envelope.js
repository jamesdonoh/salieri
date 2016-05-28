'use strict';

const _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'];
const ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

function combine(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes)
            .map(key)
            .flatten()
            .join('\n'));
}

function par(style, body) {
    return `<p style="${style}">${body}</p>`;
}

module.exports = function (options = {}) {
    function parse(body, component) {
        const parsed = JSON.parse(body);

        if (options.labels) {
            const style = 'background-color: green; color: white; position: absolute';
            parsed.bodyInline = par(style, component.id) + parsed.bodyInline;
        }

        return parsed;
    }

    function recoverError(err, component) {
        const url = component.endpoint;

        console.error('Error for %s: %s', url, err.message);

        if (options.noerrors) {
            return {};
        }

        const style = 'border: 1px solid red; color: red;';

        return { bodyInline: par(style, `FAILED: ${url}`) };
    }

    return {
        parse: parse,
        combine: combine,
        recoverError: recoverError
    };
};

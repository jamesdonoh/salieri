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

module.exports = function (options = {}) {
    function parse(body, component) {
        let parsed = JSON.parse(body);

        if (options.labels) {
            parsed.bodyInline = `
                <p style="background-color: green; color: white; position: absolute">${component.id}</p>
                ${parsed.bodyInline}
            `;
        }

        return parsed;
    }

    function recoverError(err, component) {
        const url = component.endpoint;

        console.error('Error for %s: %s', url, err.message);

        if (options.noerrors) {
            return {};
        } else {
            return { bodyInline: `<p style="border: 1px solid red; color: red;">FAILED: ${url}</p>` };
        }
    }

    return {
        parse: parse,
        combine: combine,
        recoverError: recoverError
    }
};

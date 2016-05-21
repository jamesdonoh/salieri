'use strict';

/*
The `envelope` module supports the following options to aid with debugging:

- showErrors: if `true`, add an error message to the page for any components that 
  could not be requested or parsed (default `true`)
- addLabels: prepends the bodyInline of each component with an HTML label containing
  the component's `id` property (default `false`)
*/

const _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'],
    ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

const DEFAULT_OPTIONS = {
    showErrors: true,
    addLabels: false
};

function combine(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes)
            .map(key)
            .flatten()
            .join('\n'));
}

module.exports = function (options) {
    options = _.defaults(options, DEFAULT_OPTIONS);

    function parse(body, component) {
        let parsed = JSON.parse(body);

        if (options.addLabels) {
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

        if (options.showErrors) {
            return { bodyInline: `<p style="border: 1px solid red; color: red;">FAILED: ${url}</p>` };
        } else {
            return {};
        }
    }

    return {
        parse: parse,
        combine: combine,
        recoverError: recoverError
    }
};

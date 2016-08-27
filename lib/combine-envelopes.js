// TODO Get rid of lash?
const _ = require('lodash');

const ENVELOPE_KEYS = ['head', 'bodyInline', 'bodyLast'];
const ENVELOPE = Object.freeze(_.zipObject(ENVELOPE_KEYS));

// Reference implementation:
// https://github.com/bbc/composition/blob/master/lib/composition/page/model.rb
function combine(envelopes) {
    return _.mapValues(ENVELOPE, (value, key) =>
        _(envelopes)
            .map(key)
            .flatten()
            .join('\n'));
}

module.exports = (req, res, next) => {
    /*
    for (component of res.locals.components) {
        if (component.id === 'non-json') {
//            console.dir(component);
        }
    }
    */

    const envelopes = res.locals.components.map((component) => component.envelope);

    res.locals.envelopeData = combine(envelopes);

    next();
};

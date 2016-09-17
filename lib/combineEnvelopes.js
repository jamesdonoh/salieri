const envelope = require('./envelope');

module.exports = (req, res, next) => {
    const envelopes = res.locals.components.map((component) => component.envelope);

    res.locals.combinedEnvelopes = envelope.combine(envelopes);

    next();
};

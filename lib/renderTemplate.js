const envelope = require('./envelope');
const Mustache = require('mustache');

module.exports = (req, res, next) => {
    const template = res.app.locals.template;
    const envelopes = res.locals.components.map((component) => component.envelope);

    const page = Mustache.render(template, envelope.combine(envelopes));

    res.send(page);
};

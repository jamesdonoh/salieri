const Mustache = require('mustache');
const envelope = require('./envelope');

module.exports = (req, res) => {
    const template = req.app.locals.template;
    const envelopes = res.locals.components.map((component) => component.envelope);

    const page = Mustache.render(template, envelope.combine(envelopes));

    res.send(page);
};

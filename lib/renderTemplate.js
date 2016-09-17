const Mustache = require('mustache');

module.exports = (req, res, next) => {
    res.send(Mustache.render(res.app.locals.template, res.locals.envelopeData || {}));
};

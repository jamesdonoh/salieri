const Mustache = require('mustache');

module.exports = (req, res, next) => {
    const page = Mustache.render(res.app.locals.template, res.locals.combinedEnvelopes || {});

    res.send(page);
};

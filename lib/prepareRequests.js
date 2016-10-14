const Mustache = require('mustache');

module.exports = (req, res, next) => {
    const configWithParams = Mustache.render(req.app.locals.config, req.query);

    res.locals.contents = JSON.parse(configWithParams).contents;

    next();
};

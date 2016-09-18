const Mustache = require('mustache');

module.exports = (req, res, next) => {
    const configWithParams = Mustache.render(req.app.locals.config, req.query);

    res.locals.components = JSON.parse(configWithParams).components;

    next();
};

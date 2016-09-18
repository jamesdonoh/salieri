const express = require('express');

const PORT = 3000;

module.exports = (rp, config, template, labelAll = false, logErrors = true, port = PORT) => {
    const app = express();

    app.locals.config = config;
    app.locals.template = template;

    app.locals.labelAll = labelAll;
    app.locals.logError = (...args) => logErrors && console.error(...args);

    app.get(
        '/',
        require('./prepareRequests'),
        require('./makeRequests')(rp),
        require('./handleErrors'),
        require('./addLabels'),
        require('./renderTemplate')
    );

    return app.listen(port, () => console.log('Salieri composing on port %d', port));
};

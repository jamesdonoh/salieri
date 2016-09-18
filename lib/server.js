const express = require('express');

module.exports = (config, template, labelAll = false, port = 3000) => {
    const app = express();

    app.locals.config = config;
    app.locals.template = template;

    app.locals.labelAll = labelAll;
    app.locals.logError = (...args) => process.env.NODE_ENV !== 'test' && console.error(...args);

    app.get(
        '/',
        require('./prepareRequests'),
        require('./makeRequests'),
        require('./handleErrors'),
        require('./addLabels'),
        require('./renderTemplate')
    );

    return app.listen(port, () => console.log('Salieri composing on port %d', port));
};

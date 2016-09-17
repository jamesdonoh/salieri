const rp = require('./rp');

// Wait up to 30s for servers to send response headers
const READ_TIMEOUT = 30000;

module.exports = (req, res, next) => {
    const makeRequest = (component) => {
        const options = {
            uri: component.endpoint,
            resolveWithFullResponse: true,
            simple: false,
            json: true,
            timeout: READ_TIMEOUT
        };

        const handleResult = (result) => component.result = result;

        return rp(options)
            .then(handleResult)
            .catch(handleResult);
    };

    const promises = res.locals.components.map(makeRequest);

    Promise.all(promises)
        .then(() => next());
};

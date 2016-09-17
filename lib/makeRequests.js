const rp = require('./rp');

const makeRequest = (component) => {
    const handleResult = (result) => component.result = result;

    return rp(component.endpoint)
        .then(handleResult)
        .catch(handleResult);
};

module.exports = (req, res, next) => {
    const requestPromises = res.locals.components.map(makeRequest);

    Promise.all(requestPromises)
        .then(() => next());
};

module.exports = (rp) => {
    const makeRequest = (component) => {
        const handleResult = (result) => component.result = result;

        return rp(component.endpoint)
            .then(handleResult)
            .catch(handleResult);
    };

    return (req, res, next) => {
        const requestPromises = res.locals.components.map(makeRequest);

        Promise.all(requestPromises)
            .then(() => next());
    }
};

const stringUtils = require('./stringUtils');
const envelope = require('./envelope');

const [ SUCCEEDED, WARNING, FAILED ] = [ 'succeeded', 'warning', 'failed' ];

const excerpt = (body) => body ? ` - ${stringUtils.excerpt(body, 64)}` : '';
const responseSummary = ({statusCode, statusMessage, body}) => `${statusCode} ${statusMessage}${excerpt(body)}`;

const decideStatus = (comp) => {
    if (comp.result.error) { // e.g. DNS lookup failure or connection timeout
        comp.status = FAILED;
        comp.reason = comp.result.error.message;
    } else if (comp.result.statusCode !== 200) {
        comp.status = comp.result.statusCode === 202 ? WARNING : FAILED;
        comp.reason = responseSummary(comp.result);
    } else if (!envelope.isValid(comp.result.body)) {
        comp.status = FAILED;
        comp.reason = 'Invalid envelope';
    } else {
        comp.status = SUCCEEDED;
    }
};

module.exports = (req, res, next) => {
    for (component of res.locals.components) {
        decideStatus(component);

        if (component.status === SUCCEEDED) {
            component.envelope = component.result.body;
        } else {
            const message = `${component.id} ${component.status} - ${component.reason}`;
            if (req.app.locals.logError) {
                req.app.locals.logError(message);
            }

            if (req.app.locals.strictMode && component.must_succeed) {
                return next(component.result.error);
            }
        }
    }

    next();
};

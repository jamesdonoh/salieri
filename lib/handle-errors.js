const stringUtils = require('./stringUtils');
const envelopeUtils = require('./envelopeUtils');

const [ SUCCEEDED, WARNING, FAILED ] = [ 'succeeded', 'warning', 'failed' ];

const responseSummary = ({statusCode, statusMessage, body}) => `${statusCode} ${statusMessage} - ${body}`;

const strictMode = false; // strict mode respects must_succeed

const decideStatus = (comp) => {
    if (comp.result.error) { // e.g. DNS lookup failure or connection timeout
        comp.status = FAILED;
        comp.reason = comp.result.error.message;
    } else if (comp.result.statusCode !== 200) {
        comp.status = comp.result.statusCode === 202 ? WARNING : FAILED;
        comp.reason = 'Non-200 response (' + responseSummary(comp.result) + ')';
    } else if (!envelopeUtils.isValid(comp.result.body)) {
        comp.status = FAILED;
        comp.reason = 'Invalid envelope (' + stringUtils.excerpt(comp.result.body) + ')';
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
            req.app.locals.logError(message);

            if (strictMode && component.must_succeed) {
                return next(component.result.error || new Error(message));
            }
        }
    }

    next();
};
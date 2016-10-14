const string = require('./string');
const envelope = require('./envelope');

const [SUCCEEDED, WARNING, FAILED] = ['succeeded', 'warning', 'failed'];
const HTTP_202_ACCEPTED = 202;
const HTTP_200_OK = 200;
const BODY_EXCERPT_LEN = 64;

const excerpt = (body) => body ? ` - ${string.excerpt(body, BODY_EXCERPT_LEN)}` : '';
const responseSummary = ({ statusCode, statusMessage, body }) => `${statusCode} ${statusMessage}${excerpt(body)}`;

const decideStatus = (comp) => {
    if (comp.result.error) { // e.g. DNS lookup failure or connection timeout
        comp.status = FAILED;
        comp.reason = comp.result.error.message;
    } else if (comp.result.statusCode !== HTTP_200_OK) {
        comp.status = comp.result.statusCode === HTTP_202_ACCEPTED ? WARNING : FAILED;
        comp.reason = responseSummary(comp.result);
    } else if (!envelope.isValid(comp.result.body)) {
        comp.status = FAILED;
        comp.reason = 'Invalid envelope';
    } else {
        comp.status = SUCCEEDED;
    }
};

module.exports = (req, res, next) => {
    for (const component of res.locals.contents) {
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

    return next();
};

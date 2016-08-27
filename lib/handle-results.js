// 'Real' Express error-handling middleware is only designed to be called once
//
// The approach here keeps all error management in one place at the expense of 
// being able to fail-fast on the first error.

const truncate = (str, len) => str.substr(0, len) + (str.length > len ? '...' : '');
const clean = (str) => str.replace(/\s+/g, ' ').trim();
const excerpt = (str) => truncate(clean(str), 64);

let strict = false; // strict mode respects must_succeed

module.exports = (req, res, next) => {
    for (component of res.locals.components) {
        const result = component.result;
        delete component.result;

        // Liking the clean/consistent output of this, not liking the way the code looks

        if (result.error) {
            component.status = 'failed';
            component.reason = result.error.message;
        } else if (result.statusCode === 202) {
            component.status = 'warning';
            component.reason = result.body;
        } else if (result.statusCode !== 200) {
            component.status = 'failed';
            component.reason = 'Non-200 response (' + result.statusCode + ')';
        } else if (typeof result.body !== 'object') {
            component.status = 'warning';
            component.reason = 'Invalid response ("' + excerpt(result.body) + '")';
        } else {
            component.status = 'succeeded';
            component.envelope = result.body;
        }

        if (component.status !== 'succeeded') {
            if (strict && component.must_succeed) {
                const message = `Mandatory component ${component.id} failed (${component.reason})`;
                return next(new Error(message));
            }

            // Handle missing id here
            console.error(`${component.id} ${component.status} - ${component.reason}`);
        }
    }

    next();
};

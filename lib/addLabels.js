const string = require('./string');
const labelStyles = require('./styles');

const SUCCEEDED = 'succeeded';

const createDiv = (classes, content) => `<div class="${classes}">${content}</div>`;

const labelFor = (component) => component.id + (component.status === SUCCEEDED ? ' ⌄' : ` [${component.status}]: ${component.reason}`);

const addLabel = (component) => {
    const content = labelFor(component);
    const classes = `sal-label sal-label--${component.status}`;
    const labelDiv = createDiv(classes, string.escapeHtml(content));

    if (component.envelope) {
        component.envelope.bodyInline = labelDiv + component.envelope.bodyInline;
    } else {
        component.envelope = { bodyInline: labelDiv };
    }
};

module.exports = (req, res, next) => {
    let labelsAdded = 0;

    for (const component of res.locals.contents) {
        if (component.status !== SUCCEEDED || req.app.locals.labelAll) {
            addLabel(component);
            labelsAdded += 1;
        }
    }

    if (labelsAdded > 0) {
        res.locals.contents.push(labelStyles);
    }

    next();
};

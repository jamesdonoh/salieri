const labelAll = true;

const stringUtils = require('./stringUtils');
const labelStyles = require('./styles');

const SUCCEEDED = 'succeeded';

const createDiv = (classes, content) => `<div class="${classes}">${content}</div>`;

const labelFor = (component) => component.id + ((component.status === SUCCEEDED) ? ' ⌄' : ` [${component.status}]: ${component.reason}`);

const addLabel = (component) => {
    const content = labelFor(component);
    const classes = `sal-label sal-label--${component.status}`;
    const labelDiv = createDiv(classes, stringUtils.escapeHtml(content));

    if (component.envelope) {
        component.envelope.bodyInline = labelDiv + component.envelope.bodyInline;
    } else {
        component.envelope = { bodyInline: labelDiv };
    }
};

module.exports = (req, res, next) => {
    let labelsAdded = 0;

    for (component of res.locals.components) {
        if (component.status !== SUCCEEDED || labelAll) {
            addLabel(component);
            labelsAdded++;
        }
    }

    if (labelsAdded > 0) {
        res.locals.components.push(labelStyles);
    }

    next();
};

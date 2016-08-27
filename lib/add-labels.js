const addLabels = true;

// Move this
const fs = require('fs');
const readFile = (filename) => fs.readFileSync(filename, 'utf-8');

const escapeHtml = (unsafe) => unsafe.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#039;');

function elem(elem, classes, content) {
    return classes ? `<${elem} class="${classes}">${content}</${elem}>` : `<${elem}>${content}</${elem}>`;
}

function addErrorMessage(component) {
    if (component.result.error) {
        component.result.body = { bodyInline: component.result.error };
    }
}

// TODO tidy this up
function addLabel(component) {
    let labelContent = component.id;
    let classes = `sal-label sal-label--${component.status}`;

    if (component.status === 'succeeded') {
        labelContent += ' ⌄';
    } else {
        labelContent += ` [${component.status}]: ${component.reason}`
    }

    const label = elem('div', classes, escapeHtml(labelContent));

    if (component.envelope && component.envelope.bodyInline) {
        component.envelope.bodyInline = label + component.envelope.bodyInline;
    } else {
        component.envelope = { bodyInline: label };
    }
}

function getCssComponent() {
    return {
        envelope: {
            head: '<style type="text/css">\n' + readFile('salieri.css') + '</style>',
            bodyInline: [],
            bodyLast: ''
        }
    }
}

module.exports = (req, res, next) => {
    //console.dir(res.locals.components, { depth: 2, colors: true });

    for (component of res.locals.components) {
        if (component.status !== 'succeeded' || addLabels) {
            addLabel(component);
        }
    }

    // Do this conditionally
    res.locals.components.push(getCssComponent());

    next();
};

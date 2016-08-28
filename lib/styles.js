const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'salieri.css');
const cssData = fs.readFileSync(filePath, 'utf-8');

module.exports = {
    id: 'salieri-labels',
    envelope: {
        head: `<style type="text/css">\n${cssData}</style>`,
        bodyInline: [],
        bodyLast: ''
    }
};

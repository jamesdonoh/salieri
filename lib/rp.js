const fs = require('fs');
let rp = require('request-promise');

const readFile = (filename) => fs.readFileSync(filename, 'utf-8');
//const certData = readFile('/etc/pki/certificate.pem');
//rp = rp.defaults({ cert: certData, key: certData, ca: readFile('/etc/pki/cloudservicesroot.pem') });

// Wait up to 30s for servers to send response headers
const READ_TIMEOUT = 30000;

const options = {
    resolveWithFullResponse: true,
    simple: false,
    json: true,
    timeout: READ_TIMEOUT
};

rp = rp.defaults(options);

module.exports = rp;

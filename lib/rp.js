const readFile = (filename) => require('fs').readFileSync(filename, 'utf-8');

// Wait up to 30s for servers to send response headers
const READ_TIMEOUT = 30000;

module.exports = (cert, cacert) => {
    let rp = require('request-promise');

    rp = rp.defaults({
        resolveWithFullResponse: true,
        simple: false,
        json: true,
        timeout: READ_TIMEOUT
    });

    if (cert) {
        const certData = readFile(cert);
        rp = rp.defaults({ cert: certData, key: certData });
    }

    if (cacert) {
        const caCertData = readFile(cacert);
        rp = rp.defaults({ ca: caCertData });
    }

    return rp;
}

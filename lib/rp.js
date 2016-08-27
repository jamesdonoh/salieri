const fs = require('fs');
let rp = require('request-promise');

const readFile = (filename) => fs.readFileSync(filename, 'utf-8');
const certData = readFile('/etc/pki/certificate.pem');
rp = rp.defaults({ cert: certData, key: certData, ca: readFile('/etc/pki/cloudservicesroot.pem') });

module.exports = rp;

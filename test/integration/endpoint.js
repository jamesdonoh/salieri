const express = require('express');
const app = express();
const PORT = 3001;

app.use('/', express.static(`${__dirname}/content`));

app.get('/error', (req, res) => res.status(500).send('Things failed'));
app.get('/accepted', (req, res) => res.status(202).send('No payload'));

app.listen(PORT, () => {
    console.log(`Endpoint server listening on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = 3001;

app.use('/', express.static(`${__dirname}/content`));

app.listen(PORT, () => {
    console.log(`Endpoint server listening on port ${PORT}`);
});

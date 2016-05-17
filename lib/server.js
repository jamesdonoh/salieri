'use strict';

const express = require('express');

function start(buildPage, port) {
    express()
        .get('/', (req, res, next) =>
            buildPage()
                .then(page => res.send(page))
                .catch(next)
        )
        .listen(port);
}

exports.start = start;

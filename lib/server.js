'use strict';

const express = require('express');

function createServer(buildPage) {
    return express()
        .get('/', (req, res, next) =>
            buildPage(req.query)
                .then((page) => res.send(page))
                .catch(next)
        );
}

exports.createServer = createServer;

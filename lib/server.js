'use strict';

const express = require('express');
const proxy = require('express-http-proxy');

function createServer(buildPage, staticPrefix, staticHost, staticPath) {
    const app = express();

    app.use(staticPrefix, proxy(staticHost, {
        preserveHostHdr: true,
        forwardPath: function(req, res) {
          console.log("static asset request: ", staticPath + req.url);
          return staticPath + req.url;
        }
    }));

    app.get('/', (req, res, next) =>
        buildPage(req.query)
            .then((page) => res.send(page))
            .catch(next)
    );
    return app;
}

exports.createServer = createServer;

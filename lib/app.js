'use strict';

import express from 'express';
import http from 'http';
import minifyHTML from 'express-minify-html';
import exphbs from 'express-handlebars';
import helpers from './helpers';
import store from './routers/store';
import admin from './routers/admin';
import cache from './cache';
import log4js from 'log4js';


const accessLogger = log4js.getLogger('access');
const logger = log4js.getLogger('server');

const app = express();

app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: 'views',
    defaultLayout: 'container',
    helpers: helpers,
    partialsDir: [
        'views/layouts',
        'views/templates'
    ]
}));

app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: false,
        removeAttributeQuotes:     false,
        removeEmptyAttributes:     false,
        minifyJS:                  true
    }
}));


app.use('/*', (req, res, next) => {
    accessLogger.info(req.originalUrl);
    next();
});
app.use('/storechile', store);
app.use('/storeperu', store);
app.use('/admin', admin);


cache.reload('loggerConf');
cache.reload('serverConf', config => {
    const server = http.createServer(app);
    server.listen(config.server.port, function () {
        logger.info(`server starts, listening ${config.server.port}`);
    });
    server.on('connection', socket => {
        logger.info("A new connection was made by a client ----------------------");
        socket.setTimeout(30000);
    });
});

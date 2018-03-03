'use strict';

import express from 'express';
import minifyHTML from 'express-minify-html';
import exphbs from 'express-handlebars';
import helpers from './helpers';
import store from './routers/store';
import admin from './routers/admin';
import cache from './cache';
import log4js from 'log4js';


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

/*app.use(minifyHTML({
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
}));*/
app.use('/storechile', store);
app.use('/storeperu', store);
app.use('/admin', admin);


cache.reload('loggerConf');
cache.reload('serverConf', config => {
    app.listen(config.server.port, function () {
        logger.info('start');
    });
});

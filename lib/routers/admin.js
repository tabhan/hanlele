'use strict';

import _ from 'lodash';
import log4js from 'log4js';
import cache from '../cache';
import express from 'express';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';

const logger = log4js.getLogger('router');

function handleGET(req, res) {
    const {key, path} = req.params;
    logger.debug('enter admin router, GET', key, path);
    const ret = cache.get(key, path);

    logger.info('accept', req.headers.accept)
    res.status(ret === undefined ? 404 : 200);
    if(_.invoke(req, ['headers', 'accept', 'indexOf'], 'json') > -1){
        res.json(ret);
    }else{
        res.render('layouts/admin', {
            item: ret,
            edit: !_.isObjectLike(ret),
            baseurl: req.originalUrl,
            helpers: {
                appendKey : (url, key) => url + '/' + key,
                hasChidren: (value) => _.isObjectLike(value)
            }
        });
    }
}

function handleDELETE(req, res, next) {
    const {key, path} = req.params;
    logger.info('DELETE', key, path);

    cache.del(key, path);
    if (_.isEmpty(path)) {
        // if all cache info is delete, reload it.
        cache.reload(key);
    }
    next();
}

function handlePOST(req, res, next) {
    const {body, params: {key, path}} = req;
    logger.info('POST', key, path, body);
    cache.set(key, path, body);
    next();
}

function parseQueryOp(req, res, next) {
    logger.trace('enter op parser');
    let handler = handleGET;

    const op = _.toLower(_.get(req, 'query.op', req.method));
    logger.debug('op', op);
    if (op === 'delete') {
        handler = handleDELETE;
    } else if (op === 'post') {
        handler = handlePOST;
    }
    handler(req, res, next);
}

function parseJSONErr(err, req, res, next) {
    req.body = JSON.parse(err.body);
    next();
}

function parsePath(req, res, next) {
    req.params.path = _.compact(_.split(req.params[0], /\//));
    next();
}

const router = express.Router();

router.route('/cache/:key*')
      .all(parsePath, bodyParser.json(), parseJSONErr, parseQueryOp, handleGET);

export default router;


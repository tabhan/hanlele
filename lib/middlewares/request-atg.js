'use strict';

import _ from 'lodash';
import log4js from 'log4js';
import request from 'request';
import cache from '../cache';

const logger = log4js.getLogger('middleware');

export default (req, res, next) => {
	const {originalUrl} = req;
    logger.trace('enter ATG request middleware', originalUrl);
	const url = cache.get('serverConf', 'store.url') + originalUrl;

    const headers = _.merge({}, req.headers);
    _.merge(headers, cache.get('serverConf', 'store.headers'));
    logger.debug('request headers', headers);
    request({
        url: url,
        json: true,
        headers: headers
    }, (err, atgRes, body) => {
        logger.debug('get response from ATG', body);
        if(err){
            logger.error('request ATG fail', err, url);
            next(500);
        }else{
            res.atgRes = atgRes;
            res.rootContentItem = body;
            next();
        }
    })
}


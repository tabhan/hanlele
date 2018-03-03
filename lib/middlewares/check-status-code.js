'use strict';

import _ from 'lodash';
import log4js from 'log4js';

const logger = log4js.getLogger('middleware');

export default (req, res, next) => {
    logger.trace('enter response code checker');
	
    const statusCode = _.get(res, 'atgRes.statusCode');
    switch (statusCode){
        case 200:
            next()
            break;
        case 500:
        case 404:
            logger.debug('request ATG fail', statusCode);
            next(statusCode);
            break;
        default:
            logger.error('request ATG fail', statusCode);
            next(res.atgRes);
            break;
    }
}


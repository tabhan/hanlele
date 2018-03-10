'use strict';

import _ from 'lodash';
import log4js from 'log4js';

const logger = log4js.getLogger('middleware');

export default (req, res, next) => {
    logger.trace('enter response headers handler');

    const headers = _.get(res, 'atgRes.headers');

    _.each(headers, (value, key) => {
        if ('content-type' !== key){
            res.set(key, value);
        }
    });

    next();
}


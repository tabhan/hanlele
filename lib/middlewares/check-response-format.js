'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('middleware');

export default (req, res, next) => {
    logger.trace('enter response format checker');
	
    const rootContentItem = res.rootContentItem;
    if(typeof rootContentItem == 'object'){
        next();
    }else{
        next(res.atgRes);
    }
}


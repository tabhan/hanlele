'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('middleware');

export default (err, req, res, next) => {
    logger.error('error', err);
	
    if(typeof err == 'number'){
        res.status(err).render(err.toString());
    }else{
        res.status(500).send(err.body);
    }
}


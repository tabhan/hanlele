'use strict';

import log4js from 'log4js';
import cache from '../cache';

const logger = log4js.getLogger('helper');

export default (page, key, options) => {
    logger.trace('enter get content message helper');
    if(logger.isDebugEnabled()){
        logger.debug('get content message', {
            page: page,
            key: key
        });
    }

    const msg = cache.get('contentMsg', [page, key])
    logger.debug('content message value', msg);
    if(msg){
        return msg;
    }else{
        if(options){
            if(typeof options.fn == 'function'){
                return options.fn(this);
            }
            if(typeof options == 'string'){
                return options;
            }
        }
        return '';
    }
}
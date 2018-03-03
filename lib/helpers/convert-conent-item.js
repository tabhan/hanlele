'use strict';

import log4js from 'log4js';
import converters from '../converters';

const logger = log4js.getLogger('helper');

export default (contentItem, name) => {
    logger.trace('enter convert content item helper');

    let converterName = name;
    if(typeof converterName != 'string'){
        converterName = contentItem['@type'];
    }
    logger.debug('converterName', converterName);

    if(!converterName){
        logger.warn('content item does not have type', contentItem);
        return contentItem;
    }

    let converter = converters[converterName];
    if(!converter){
		converters[converterName] = converter = contentItem => contentItem;
    }
    return converter(contentItem);
};
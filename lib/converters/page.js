'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('converter');

export default contentItem => {
    logger.trace('enter default converter');
    if(contentItem.jsName){
        contentItem.jsArray = contentItem.jsName.split(',');
    }
    if(contentItem.cssName){
        contentItem.cssArray = contentItem.cssName.split(',');
    }
    return contentItem;
};
'use strict';

import _ from 'lodash';
import log4js from 'log4js';

const logger = log4js.getLogger('helper');

export default contentItem => {
    logger.trace('enter contentItemId helper');
    let resourcePath = _.get(contentItem, ['endeca:auditInfo', 'ecr:resourcePath']);

    if(resourcePath && resourcePath.startsWith('/')){
        resourcePath = resourcePath.substring(1);
    }

    const innerPath = _.get(contentItem, ['endeca:auditInfo', 'ecr:innerPath']);
    return innerPath == null ? resourcePath : `${resourcePath}|${innerPath}` ;
}
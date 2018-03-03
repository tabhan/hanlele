'use strict';

import log4js from 'log4js';
import cache from '../cache';

const logger = log4js.getLogger('helper');

export default e => {
    logger.trace('enter template helper');
    logger.debug('get template for', e);

    let template = e['@type'];
    logger.debug('content item type', template);

    template = cache.get('templates', template) || template;
    logger.debug('template', template);

    return template;
}
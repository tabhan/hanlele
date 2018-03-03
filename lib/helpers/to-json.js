'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('helper');

export default e => {
    logger.trace('enter json helper');

    let cache = [];
    const ret = JSON.stringify(e, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection

    return ret;
}
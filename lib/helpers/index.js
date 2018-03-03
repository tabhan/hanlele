'use strict';

import template from './template';
import contentMsg from './content-msg';
import cache from '../cache';
import convertContentItem from './convert-conent-item';
import contentItemId from './content-item-id';
import toJSON from './to-json';

export default {
    not: a => !a,
    and: (a, b) => a && b,
    or: (a, b) => a || b,
    eq: (a, b) => a == b,
    gt: (a, b) => a > b,
    ge: (a, b) => a >= b,
    lt: (a, b) => a < b,
    le: (a, b) => a <= b,
    add: (a, b) => a + b,

    toJSON: toJSON,
    fromJSON: JSON.parse,
    template: template,
    cache: cache.get,
    convertContentItem: convertContentItem,
    contentMsg: contentMsg,
    contentItemId: contentItemId
}
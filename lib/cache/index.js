'use strict';

import _ from 'lodash';
import {listenToRecordEvent} from './dispatcher';
import log4js from 'log4js';
import LoadByJSONRecord from './LoadByJSONRecord';
import ContentMsgRecord from './ContentMsgRecord';
import SiteAppConfRecord from './SiteAppConfRecord';

const records = {};

function getRecord(key) {
    const record = _.get(records, key);
    if (record !== undefined) {
        record.reload();
        return record.value;
    }
}

function pushRecord(record) {
    records[record.key] = record;
}

const cache = {
    get: (key, path) => _.isEmpty(path) ? getRecord(key) : _.get(getRecord(key), path),
    set: (key, path, value) => _.invoke(records, [key, 'set'], path, value),
    del: (key, path) => _.invoke(records, [key, 'del'], path),
    reload: (key, callback) => _.invoke(records, [key, 'reload'], callback)
};

export default cache;

pushRecord(new LoadByJSONRecord({key: 'loggerConf', file: 'config/logger-conf-default.json'}));
pushRecord(new ContentMsgRecord({
    key: 'contentMsg',
    getMsgFilePath: () => cache.get('siteAppConf', 'msgFilePath'),
    getStaticUrl: () => cache.get('serverConf', 'static.url')}));
pushRecord(new LoadByJSONRecord({key: "serverConf", file: "config/server-conf-default.json"}));
pushRecord(new LoadByJSONRecord({key: "templates", file: 'config/template-mapping.json'}));
pushRecord(new SiteAppConfRecord({
    key: 'siteAppConf',
    getStoreUrl: () => cache.get('serverConf', 'store.url'),
    getStaticUrl: () => cache.get('serverConf', 'static.url')
}));

listenToRecordEvent('loggerConf', 'change', record => {
    log4js.configure(record.value);
});

listenToRecordEvent('serverConf', 'change', () => {
    _.invoke(records, ['siteAppConf', 'reload']);
    _.invoke(records, ['contentMsg', 'reload']);
});

listenToRecordEvent('siteAppConf', 'change', () => {
    _.invoke(records, ['contentMsg', 'reload']);
});
'use strict';

import _ from 'lodash';
import {listenToRecordEvent} from './dispatcher';
import log4js from 'log4js';
import LoadByJSONRecord from './LoadByJSONRecord';
import ContentMsgRecord from './ContentMsgRecord';;
import SiteAppConfRecord from './SiteAppConfRecord';

export default {
    get: (key, path) => _.isEmpty(path) ? getRecord(key) : _.get(getRecord(key), path),
    set: (key, path, value) => _.invoke(records, [key, 'set'], path, value),
    delete: (key, path) => _.invoke(records, [key, 'delete'], path),
    reload: (key, callback) => _.invoke(records, [key, 'reload'], callback)
};

const records = {};

function getRecord(key){
    const record = _.get(records, key);
    if (record !== undefined) {
        record.reload();
        return record.value;
    }
}

function pushRecord(record){
	records[record.key] = record;
}


listenToRecordEvent('loggerConf', 'change', record => {
    log4js.configure(record.value);
});

pushRecord(new LoadByJSONRecord({key: 'loggerConf', file: 'config/logger-conf-default.json'}));
pushRecord(new ContentMsgRecord());
pushRecord(new LoadByJSONRecord({key: "serverConf", file: "config/server-conf-default.json"}));
pushRecord(new LoadByJSONRecord({key: "templates", file: "config/template-mapping.json"}));
pushRecord(new SiteAppConfRecord());


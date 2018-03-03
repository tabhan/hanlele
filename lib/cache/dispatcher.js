'use strict';

import event from 'events';
import log4js from 'log4js';

const logger = log4js.getLogger('cache');
const emitter = new event.EventEmitter();

export function emitRecordEvent(record, eventName){
    emitter.emit(record.key + '.' + eventName, record);
}

export function listenToRecordEvent(key, eventName, callback){
    emitter.on(key + '.' + eventName, record => {
        logger.debug('triggered event listener', eventName);
        callback(record);
    });
}
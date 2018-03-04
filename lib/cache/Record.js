'use strict';

import _ from 'lodash';
import log4js from 'log4js';
import {emitRecordEvent} from './dispatcher';

const logger = log4js.getLogger('cache');

export default class Record {

    constructor(opt) {
        this.clearValueOnDelete = false;

        if (typeof opt === 'string') {
            this.key = opt;
        } else if (opt !== null && typeof opt === 'object') {
            _.extend(this, opt);
        }
    }


    readyForReload() {
        return true;
    }

    /**
     * reload if required.
     * @param callback the first param of call back function is the value after loaded.
     */
    reload(callback) {
        if (this.readyForReload() && !this.isValid() && !this._loading) {
            logger.debug('do reload', this.key);
            this._loading = true;
            this.load(() => {
                delete this._loading;
            }, callback);
        } else if (typeof callback === 'function') {
            callback(this.value);
        }

    }

    /**
     * Load the value.
     * @param value
     */
    load(value) {

        let callBacks = arguments;

        // if the first argument is not callback function, use it to init cache.
        if (value != null && typeof value !== 'function') {
            callBacks = _.drop(callBacks);
            this.set(null, value);
        }

        // invoke all call back functions.
        _(callBacks).each(callback => {
            if (typeof callback === 'function') {
                callback(this.value);
            }
        });

    }

    del(path) {
		if(_.isEmpty(path)){
			delete this._loading;
			delete this._initialized;
			if (this.clearValueOnDelete) {
				delete this._value;
			}
		}else{
			_.unset(this.value, path);
			emitRecordEvent(this, 'change');
		}

    }

    set(path, value){
		if(_.isEmpty(path)){
			this._value = value;
            this._initialized = true;
		}else{
			_.set(this.value, path, value);
		}
		emitRecordEvent(this, 'change');

    }

    isValid() {
        return this._initialized;
    }

    get value() {
        return this._value;
    }

}
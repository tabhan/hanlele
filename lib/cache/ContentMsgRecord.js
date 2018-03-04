'use strict';

import _ from 'lodash';
import Record from './Record';
import request from 'request';
import log4js from 'log4js';

const logger = log4js.getLogger('cache');

export default class ContentMsgRecord extends Record {

    getMsgFilePath() {
        throw new Error('method getMsgFilePath has to be initialized when new ContentMsgRecord');
    }

    getStaticUrl() {
        throw new Error('method getStaticUrl has to be initialized when new ContentMsgRecord');
    }

    getMsgFileURL() {
        const staticURL = this.getStaticUrl();
        const msgFilePath = this.getMsgFilePath();
        if (staticURL && msgFilePath) {
            return staticURL + '/' + msgFilePath;
        } else {
            return undefined;
        }
    }

    readyForReload() {
        return super.readyForReload() && this.getMsgFileURL() !== undefined;
    }

    load() {
        logger.trace('enter content message loader');
        const msgFilePath = this.getMsgFilePath();
        const url = this.getMsgFileURL();
        logger.info('send request to web server to get content message contents', url);
        request({
            url: url
        }, (err, ress, body) => {
			let contentMsg;
            if (!err && ress.statusCode === 200 && (contentMsg = new Function(`${body}return contentMsg;`).call())) {
                this.version = msgFilePath;
                super.load.apply(this, _.concat(contentMsg, arguments));
            } else {
                logger.error('init content message fail', url);
                super.load.apply(this, arguments);
            }
        })

    }

    isValid() {
        return super.isValid() && this.version === this.getMsgFilePath();
    }

}
'use strict';

import _ from 'lodash';
import Record from './Record';
import request from 'request';
import log4js from 'log4js';

const logger = log4js.getLogger('cache');

export default class SiteAppConfRecord extends Record{

    constructor(){
        super({
            key: 'siteAppConf',
            requiredCaches: ['serverConf']
        });
    }

    readyForReload() {
        return super.readyForReload() && this.globalGet('serverConf', 'store') !== undefined;
    }

    load(){
        logger.trace('enter site app config loader');
        const url = this.globalGet('serverConf', 'store.url') + '/REST/appmeta/site/current?sessionRestored=true';
        logger.info('send request to web server to get site app config', url);
        request({
            url: url,
            json: true
        }, (err, ress, body) => {
            if(!err && body.success){
                const data = _.merge({}, body.response, {
                    staticHostUrl: this.globalGet('serverConf', 'static.url') + '/' + 
						_.get(body, 'response.versionInfo'),
                    storeHostUrl: this.globalGet('serverConf', 'store.url')
                });
                super.load.apply(this, _.concat(data, arguments));
            }else{
                logger.error('init site app config fail', url);
                super.load.apply(this, arguments);
            }
        })

    }
}
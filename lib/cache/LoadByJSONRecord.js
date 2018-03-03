'use strict';

import _ from 'lodash';
import fs from 'fs';
import Record from './Record';
import log4js from 'log4js';

const logger = log4js.getLogger('cache');

const loadJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));

export default class LoadByJSONRecord extends Record{

    load(){
        logger.trace('enter object record loader');

        let data = {};
        if(this.file){
            data = loadJSON(this.file);
        }

        const file = _.get(process.env, this.env);
        if(file !== undefined){
            _.merge(data, loadJSON(file));
        }

        super.load.apply(this, _.concat(data, arguments));
    }

}
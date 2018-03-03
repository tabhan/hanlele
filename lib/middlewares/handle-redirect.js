'use strict';

import _ from 'lodash';
import log4js from 'log4js';

const logger = log4js.getLogger('middleware');

export default (req, res, next) => {
    logger.trace('enter redirect handler');
	
    const redirect = _.get(res, 'rootContentItem.endeca:redirect');
    if(_.get(redirect, '@type') != 'Redirect'){
		next();
		return;
	}
	
	logger.debug('redirect', redirect);

    const url = _.get(redirect, 'link.url');
	if(url){
		res.redirect(url);
		return;
	}
	
	logger.error('redirect has no url property', redirect);
	next();
}


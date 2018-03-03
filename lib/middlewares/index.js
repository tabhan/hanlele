'use strict';

import requestAtg from './request-atg';
import checkStatusCode from './check-status-code';
import checkResponseFormat from './check-response-format';
import handleRedirect from './handle-redirect';
import handleError from './error';

export default [
	requestAtg,
	checkStatusCode,
	checkResponseFormat,
	handleRedirect,
	handleError
]
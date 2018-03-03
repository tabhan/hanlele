'use strict';

import express from 'express';
import middlewares from '../middlewares';
import log4js from 'log4js';

const logger = log4js.getLogger('router');
const router = express.Router();

router.all('/*', middlewares, (req, res) => {
    logger.trace('enter store router');

    const rootContentItem = res.rootContentItem;
    rootContentItem.rootContentItem = rootContentItem;
    res.render('templates/include', rootContentItem);
});

export default router;
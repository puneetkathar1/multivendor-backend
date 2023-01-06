import express from 'express';
import businessController from './business.controller.js';
import { sanitize } from '../../../middleware/sanitizer.js';
import {  jwtStrategy, } from '../../../middleware/strategy.js';

export const businessRouter = express.Router();
businessRouter.route('/getAllProductProfit').get(sanitize(),jwtStrategy, businessController.getAllBill);

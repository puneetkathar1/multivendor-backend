import express from 'express';
import vendorController from './vendor.controller.js';
import { sanitize } from '../../../middleware/sanitizer.js';
import { jwtStrategy} from '../../../middleware/strategy.js';
import upload from '../../../awsbucket.js';

import { validateBody, schemas } from '../../../middleware/validator.js';
export const vendorRouter = express.Router();

//admin panel
vendorRouter.route('/list').get(sanitize(), jwtStrategy , vendorController.getAllvendor);

//seller dashboard api 
vendorRouter.route('/shop-create').post(validateBody(schemas.shopSchema),jwtStrategy,vendorController.sellerShopCreate);
vendorRouter.route('/shop-detail').get( jwtStrategy,vendorController.sellerShopDetail);
vendorRouter.route('/shop-delete').delete( jwtStrategy,vendorController.sellerShopDelete);
// website vendor 
vendorRouter.route('/contact-create').post(vendorController.websiteVendorContactCreate);
vendorRouter.route('/sellar/website-list').get(jwtStrategy, vendorController.websiteVendorContactList);
vendorRouter.route('/product/getAllProductById').get(jwtStrategy, vendorController.sellerProductList);









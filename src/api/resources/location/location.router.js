import express from 'express';
import locationController from './location.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { jwtStrategy , jwtCustomerStrategy} from '../../../middleware/strategy';
import { validateBody, schemas } from '../../../middleware/validator';

export const locationRouter = express.Router();
locationRouter.route('/create').post(sanitize(),validateBody(schemas.location),locationController.index);
locationRouter.route('/list').get(sanitize(), locationController.List);
locationRouter.route('/delete').delete(sanitize(),locationController.getLocationDelete);
locationRouter.route('/update').post(sanitize(),locationController.getLocationUpdate);

//area create
locationRouter.route('/area/create').post(sanitize(),validateBody(schemas.area),locationController.areaCreate);
locationRouter.route('/area/delete').delete(sanitize(),locationController.getAreaDeleteById);
locationRouter.route('/area/getAllAreaList').get(sanitize(),locationController.getAreaList);

locationRouter.route('/city/update').post(sanitize(),locationController.getCityUpdate);
locationRouter.route('/city/list').get(sanitize(),locationController.cityList);
locationRouter.route('/city/create').post(sanitize(),validateBody(schemas.city),locationController.cityCreate);
locationRouter.route('/city/delete').delete(sanitize(), locationController.deleteCity);

// get location 
locationRouter.route('/area/list/getbyid').get(sanitize(),locationController.getAreaListById);










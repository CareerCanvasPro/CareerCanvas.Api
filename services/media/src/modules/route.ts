import * as express from 'express'
import multer from "multer";

import MediaServiceController from './controller';


const upload = multer({ dest: 'uploads/' }); // Define your upload directorydo
const mediaServiceController = new MediaServiceController();

export default class ServiceRoutes {
  public path = '/media'
  public router = express.Router()

  constructor() {
      this.initRoutes()
  }
  
  public initRoutes() {
    this.router.post('/uploadphoto',
      upload.single('imageData'), 
      mediaServiceController.uploadMedia)
  }
}

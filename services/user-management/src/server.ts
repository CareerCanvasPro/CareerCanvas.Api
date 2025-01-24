
import * as bodyParser from 'body-parser';
import cors from "cors";
import morgan from "morgan";

import config from '../config/config';


import App from './app';
import ServiceRoutes from './modules/route';
const app = new App({
    port: 8000,
    routes: [
        new ServiceRoutes()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        morgan('dev'),
        cors()
    ]
})

app.listen()

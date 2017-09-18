import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import fs from 'fs';

import {configProd, configDev, configTest} from './config';
import routes from './routes';
import {errorHandler} from './utils/errors';

const app = express();

const config = app.get('env') === 'production' ?
    configProd :
    app.get('env') === 'test' ? configTest : configDev;

const httpsOptions = {
    key: fs.readFileSync(__dirname + '/../key.pem'),
    cert: fs.readFileSync(__dirname + '/../cert.pem')
};

// middleware ---------------------------------------

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

// routes ------------------------------------------
app.use('/', routes(config));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(errorHandler(err));
});

app.serverListening = https.createServer(httpsOptions, app).listen(config.port, () => {
    console.log('Server listening on port ' + config.port);
});

export default app;

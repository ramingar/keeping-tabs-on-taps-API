import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import fs from 'fs';
import {configProd, configDev} from './config';

const app = express();
const config = app.get('env') === 'production' ? configProd : configDev;

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

app.get('/', (req, res) => {
    res.status(200).json({message: 'Server up!!'});
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler ----------------------
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: {}
    });
});


https.createServer(httpsOptions, app).listen(config.port, () => {
    console.log('Server listening on port ' + config.port);
});

export default app;

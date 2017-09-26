import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import fs from 'fs';
import passport from 'passport';
import {Strategy} from 'passport-local';

import configuration from './config';
import routes from './routes';
import User from './model/user';
import {errorHandler} from './utils/errors';

const app = express();

// CONFIG ------------------------------------------------------------------------

const config = configuration(app);

// passport config
const localStrategy = Object.create(Strategy.prototype);
localStrategy.constructor({usernameField: 'email', passwordField: 'pass'}, User.authenticate());

app.use(passport.initialize());
passport.use(localStrategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE -------------------------------------------------------------------

app.use(bodyParser.json({
    limit: process.env.APP_BODY_LIMIT || config.bodyLimit
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

// ROUTES -----------------------------------------------------------------------
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

// RUN SERVER -------------------------------------------------------------------

if ('production' === app.get('env') || 'test' === app.get('env')) {

    // SSL termination is done on Heroku servers/load-balancers before the traffic gets to the application.
    // So in production, Heroku is in charge of HTTPS.

    app.serverListening = app.listen(process.env.PORT || config.port, () => {
        const listeningPort = process.env.PORT || config.port;
        console.log('Server listening on port ' + listeningPort);
    });

} else {

    // In other environment, we are in charge of managing HTTPS connections

    const httpsOptions = {
        key: fs.readFileSync(__dirname + '/../key.pem'),
        cert: fs.readFileSync(__dirname + '/../cert.pem')
    };

    app.serverListening = https.createServer(httpsOptions, app).listen(process.env.PORT || config.port, () => {
        const listeningPort = process.env.PORT || config.port;
        console.log('Server listening on port ' + listeningPort);
    });
}

export default app;

import express from 'express';

const app = express();

const errorHandler = (err) => {

    // no stacktraces leaked to user
    const responseJson = {
        message: err.message,
        error: {}
    };

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        responseJson.error = err;
    }

    return responseJson;
};

const passportLocalMongooseErrorsCode = {
    MissingPasswordError: 400,
    AttemptTooSoonError: 403,
    TooManyAttemptsError: 403,
    NoSaltValueStoredError: 500,
    IncorrectPasswordError: 403,
    IncorrectUsernameError: 403,
    MissingUsernameError: 400,
    UserExistsError: 409
};

export {errorHandler, passportLocalMongooseErrorsCode};
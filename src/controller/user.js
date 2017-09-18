import db from '../db';
import User from '../model/user';
import {errorHandler, passportLocalMongooseErrorsCode} from '../utils/errors';

const postUser = (req, res, config) => {

    db.connect(config);

    User.register(User({email: req.body.email}), req.body.pass, function (err, user) {
        if (err) {
            db.disconnect();
            return res.status(err.status || passportLocalMongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        }

        user.name = req.body.name;
        user.save().then((response) => {
                db.disconnect();
                const {_id, name, email} = response;
                const payload = Object.assign({}, {_id, name, email});
                res.status(201).json(payload);
            }, (err) => {
                db.disconnect();
                res.status(err.status || 500).json(errorHandler(err));
            }
        );
    });

};

export {postUser};

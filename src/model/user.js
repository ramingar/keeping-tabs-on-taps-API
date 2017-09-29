import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    pass: {
        type: String
    },
    debtsCreditor: [{
        type: Schema.Types.ObjectId,
        ref: 'Debt'
    }],
    debtsDebtor: [{
        type: Schema.Types.ObjectId,
        ref: 'Debt'
    }]
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
export default mongoose.model('User', UserSchema);

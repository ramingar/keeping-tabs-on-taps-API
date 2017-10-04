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
    contractsCreditor: [{
        type: Schema.Types.ObjectId,
        ref: 'Contract'
    }],
    contractsDebtor: [{
        type: Schema.Types.ObjectId,
        ref: 'Contract'
    }]
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
export default mongoose.model('User', UserSchema);

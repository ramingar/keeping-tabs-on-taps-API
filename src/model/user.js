import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    pass: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
export default mongoose.model('User', UserSchema);

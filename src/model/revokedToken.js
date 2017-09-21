import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const RevokedTokenShema = Schema({
    tokenId: {
        type: String,
        required: true
    },
    userId: {
        type: String
    },
    date: {
        type: Date
    },
    expireAt: {
        type: Date,
        required: true
    }
});

RevokedTokenShema.index({expireAt: 1}, {expireAfterSeconds: 0});
export default mongoose.model('RevokedToken', RevokedTokenShema);

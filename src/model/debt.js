import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import {Schema} from 'mongoose';

const DebtShema = Schema({
    creditorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    debtorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    concept: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'waiting'
    }
});

DebtShema.plugin(mongoosePaginate);
export default mongoose.model('Debt', DebtShema);

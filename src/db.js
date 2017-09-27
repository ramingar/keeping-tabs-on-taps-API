import mongoose from 'mongoose';

const connect = (config) => {
    mongoose.Promise = global.Promise;
    return mongoose.connect(process.env.APP_MONGODB || config.mongodb, {
        useMongoClient: true
    }).then(db => db, err => {
        console.log(err)
    });
};

const disconnect = () => {
    mongoose.disconnect();
};

export default {connect, disconnect};
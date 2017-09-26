import mongoose from 'mongoose';

const connect = (config) => {
    mongoose.Promise = global.Promise;
    const promise = mongoose.connect(process.env.APP_MONGODB || config.mongodb, {
        useMongoClient: true
    });

    return promise.then((db) => db);
};

const disconnect = () => {
    mongoose.disconnect();
};

export default {connect, disconnect};
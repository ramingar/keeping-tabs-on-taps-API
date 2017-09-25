import mongoose from 'mongoose';

const connect = (config) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.APP_MONGODB || config.mongodb, {
        useMongoClient: true
    });
};

const disconnect = () => {
    mongoose.disconnect();
};

export default {connect, disconnect};
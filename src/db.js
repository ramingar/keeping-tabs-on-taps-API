import mongoose from 'mongoose';

export default (config, callback) => {
    mongoose.Promise = global.Promise;
    const db = mongoose.connect(config.mongodb, {
        useMongoClient: true
    });
    callback(db);
}
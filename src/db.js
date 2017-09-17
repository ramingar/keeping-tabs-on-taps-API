import mongoose from 'mongoose';

export default (config, callback) => {
    const db = mongoose.connect(config.mongodb, {
        useMongoClient: true
    });
    callback(db);
}
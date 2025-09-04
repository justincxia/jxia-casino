module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jxia-casino',
    JWT_SECRET: process.env.JWT_SECRET || 'jwt-key',
    PORT: process.env.PORT || 5001
};
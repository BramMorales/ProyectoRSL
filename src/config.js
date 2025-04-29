require('dotenv').config();

module.exports = {
        app: {
            port: process.env.PORT || 4000 
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'notasecreta!',
            expiration: process.env.JWT_EXPIRATION || '7d',
            cookieExpires: process.env.JWT_COOKIE_EXPIRES || 1,
        },
        mysql: {
            ost: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DB || 'ejemplo',
        }
}
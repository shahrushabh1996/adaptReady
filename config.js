module.exports = {
    postgres: {
        database: process.env.POSTGRES_DATABASE,
        url: process.env.POSTGRES_URL,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT),
        dialectOptions: {
            ssl: {
                require: Boolean(process.env.SEQUALIZE_DIALECT_SSL_REQUIRE) || true,
                rejectUnauthorized: Boolean(process.env.SEQUALIZE_DIALECT_REJECT_UNAUTHORISED === "true") || false
            }
        }
    },
    sequelize: {
        dialect: process.env.SEQUALIZE_DIALECT
    },
    bcrypt: {
        saltRound: parseInt(process.env.BCRYPT_SALT_ROUND) || 10
    },
    JWT: {
        secretKey: process.env.JWT_SECRET_KEY || '',
        validity: process.env.JWT_TOKEN_VALIDITY || '1h',
    }
}
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = 'Enaam@400';
const DB_NAME = 'assignment5';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});

const connectDB = async () => {
    try {
        // create the database if it does not exist
        const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await conn.end();

        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected and tables are ready');
    } catch (error) {
        console.error('Database error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

#!/usr/bin/env mode
//backend/bin/www

//Import Environment Variables
require('dotenv').config();

const {port} = require('../config');

const app = require('../app');
const db = require('../db/models');

//Check the Database connection before starting the app
db.sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection success! Sequelize is ready to use...');
        
        //Start Listening for Connections
        app.listen(port, () => console.log(`Listening on port ${port}...`));
    })
    .catch((err) => {
        console.log('Database connection failure.');
        console.error(err);
    });
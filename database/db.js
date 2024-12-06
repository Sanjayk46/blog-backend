const mongoose = require('mongoose');
require('dotenv').config();
const connectionDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(
          `MongoDB connected successfully: Host - ${connection.connection.host}, Database - ${connection.connection.db.databaseName}`
        );
        return connection;
    }catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit the process if the connection fails
    }
}
module.exports = { connectionDB };
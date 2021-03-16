const mongoose = require("mongoose");

const port = process.env.PORT || 9000;

exports.dbConnection = async ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {useCreateIndex: true,useUnifiedTopology:true, useNewUrlParser:true, keepAlive:true,})
    .then(() => console.log(`Database is connected on port ${port}`));
    mongoose.connection.on("error", err => {
        console.log(`DB connection error: ${err.message}`);
    });
}